import { Injectable } from '@nestjs/common';
import { StationsCreateItemDTO, StationsCreateRequestBodyDTO } from '../dtos';
import { Connection } from 'typeorm';
import { StationsRepository } from '../repositories';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { StationEntity } from '@app/entities';
import { StationsGeneralService } from './general';
import { ClientsGeneralService } from '../../clients/services';
import { DistrictsGeneralService } from '../../districts/services';
import { StationsWorkersGeneralService } from '../../stations-workers/services';
import { StationsWorkersRepository } from '../../stations-workers/repositories';
import { groupedByNull } from '@app/helpers/grouped.helpers';
import { NonEmptyArray } from '@app/types';

type TStationsCreateItemWithWorker = Omit<
  StationsCreateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: number;
  index: number;
};

type TStationsCreateItemWithoutWorker = Omit<
  StationsCreateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: null;
  index: number;
};

@Injectable()
export class StationsCreateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
    private readonly connection: Connection,
  ) {}

  public async execute(data: StationsCreateRequestBodyDTO): Promise<void> {
    await this.checkStationsBeforeCreate(data.stations);
    await this.create(data.stations);
  }

  private async checkStationsBeforeCreate(
    stations: NonEmptyArray<StationsCreateItemDTO>,
  ): Promise<void> {
    const indexedStations = getIndexedArray(stations);

    await this.stationsGeneralService.allStationsNumbersNotExistsOrFail(
      indexedStations,
    );
    await this.districtsGeneralService.allDistrictsExistsOrFail(
      indexedStations,
      'districtId',
    );

    await this.checkStationsWorkersOrFail(indexedStations);
  }

  private async checkStationsWorkersOrFail(
    stations: (StationsCreateItemDTO & { index: number })[],
  ): Promise<void> {
    const [stationsWithWorkers, stationsWithoutWorkers] = groupedByNull(
      stations,
      'stationWorkerId',
    ) as [TStationsCreateItemWithWorker[], TStationsCreateItemWithoutWorker[]];

    if (isNonEmptyArray(stationsWithWorkers)) {
      // Check existing clients and workers
      const foundWorkers =
        await this.stationsWorkersGeneralService.allWorkersExistingAndMatchOfClientsOrFail(
          stationsWithWorkers,
        );
      this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
        foundWorkers,
        stationsWithWorkers,
      );
    }

    if (isNonEmptyArray(stationsWithoutWorkers)) {
      // Check existing only clients
      await this.clientsGeneralService.allClientsExistsOrFail(
        stationsWithoutWorkers,
      );
    }
  }

  private async create(stations: StationsCreateItemDTO[]): Promise<void> {
    const [stationsWithWorkers] = groupedByNull(
      stations,
      'stationWorkerId',
    ) as [TStationsCreateItemWithWorker[], TStationsCreateItemWithoutWorker[]];

    await this.connection.transaction(async (manager) => {
      const stationsRepository =
        manager.getCustomRepository(StationsRepository);
      const createdStations = await stationsRepository.saveEntities(
        stations.map(({ number, clientId, districtId }) => ({
          number,
          clientId,
          districtId,
        })),
      );

      if (isNonEmptyArray(stationsWithWorkers)) {
        await this.updateStationsWorkers(
          stationsWithWorkers,
          createdStations,
          manager.getCustomRepository(StationsWorkersRepository),
        );
      }
    });
  }

  private async updateStationsWorkers(
    stationsWithWorkers: TStationsCreateItemWithWorker[],
    createdStations: StationEntity[],
    repository: StationsWorkersRepository,
  ) {
    const getStationIdByNumber = (number: string) =>
      createdStations.find((station) => station.number === number)!.id;

    const recordsToUpdates = stationsWithWorkers.map(
      ({ stationWorkerId: userId, number }) => ({
        criteria: { userId },
        inputs: {
          stationId: getStationIdByNumber(number),
        },
      }),
    );
    await repository.updateEntities(recordsToUpdates);
  }
}
