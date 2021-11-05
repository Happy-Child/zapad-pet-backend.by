import { Injectable } from '@nestjs/common';
import { StationsCreateItemDTO, StationsCreateRequestBodyDTO } from '../dtos';
import { Connection } from 'typeorm';
import { StationsRepository } from '../repositories';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { StationEntity } from '@app/entities';
import { StationsGeneralCheckingService } from './general';
import { ClientsGeneralCheckingService } from '../../clients/services';
import { DistrictsGeneralCheckingService } from '../../districts/services';
import { StationsWorkersGeneralService } from '../../stations-workers/services';
import { StationsWorkersRepository } from '../../stations-workers/repositories';
import { groupedByNull } from '@app/helpers/grouped.helpers';

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
    private readonly stationsGeneralCheckingService: StationsGeneralCheckingService,
    private readonly clientsGeneralCheckingService: ClientsGeneralCheckingService,
    private readonly districtsGeneralCheckingService: DistrictsGeneralCheckingService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
    private readonly connection: Connection,
  ) {}

  public async execute(data: StationsCreateRequestBodyDTO): Promise<void> {
    const indexedStations = getIndexedArray(data.stations);

    await this.stationsGeneralCheckingService.allStationsNumbersNotExistsOrFail(
      indexedStations,
    );
    await this.districtsGeneralCheckingService.allDistrictsExistsOrFail(
      indexedStations,
      'districtId',
    );

    const [stationsWithWorkers, stationsWithoutWorkers] = groupedByNull(
      indexedStations,
      'stationWorkerId',
    ) as [TStationsCreateItemWithWorker[], TStationsCreateItemWithoutWorker[]];

    if (isNonEmptyArray(stationsWithWorkers)) {
      // Check existing clients and workers
      await this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
        stationsWithWorkers,
      );
    }

    if (isNonEmptyArray(stationsWithoutWorkers)) {
      // Check existing only clients
      await this.clientsGeneralCheckingService.allClientsExistsOrFail(
        stationsWithoutWorkers,
      );
    }

    await this.connection.transaction(async (manager) => {
      const stationsRepository =
        manager.getCustomRepository(StationsRepository);
      const createdStations = await stationsRepository.saveEntities(
        data.stations.map(({ number, clientId, districtId }) => ({
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
