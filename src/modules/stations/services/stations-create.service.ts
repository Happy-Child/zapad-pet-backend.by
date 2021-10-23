import { Injectable } from '@nestjs/common';
import { StationsCreateItemDTO, StationsCreateRequestBodyDTO } from '../dtos';
import { Connection } from 'typeorm';
import { StationsRepository } from '../repositories';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { UsersStationsWorkersRepository } from '../../users/repositories';
import { UsersStationsWorkersGeneralService } from '../../users/services';
import { StationEntity } from '@app/entities';
import { ClientsRepository } from '../../clients/repositories';
import { DistrictsRepository } from '../../districts/repositories';
import { StationsCheckWorkersService } from './general';
import { NonEmptyArray } from '@app/types';

type TStationsCreateItemWithWorker = Omit<
  StationsCreateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: number;
  index: number;
};

@Injectable()
export class StationsCreateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly districtsRepository: DistrictsRepository,
    private readonly stationsCheckWorkersService: StationsCheckWorkersService,
    private readonly usersStationsWorkersRepository: UsersStationsWorkersRepository,
    private readonly connection: Connection,
  ) {}

  public async create(data: StationsCreateRequestBodyDTO): Promise<void> {
    const indexedStations = getIndexedArray(data.stations);

    await this.stationsRepository.stationsNumbersNotExistsOrFail(
      indexedStations,
    );
    await this.clientsRepository.clientsExistsOrFail(indexedStations);
    await this.districtsRepository.districtsExistsOrFail(indexedStations);
    const stationsWithWorkers = await this.isValidWorkersForCreatingOrFail(
      indexedStations,
    );

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
          manager.getCustomRepository(UsersStationsWorkersRepository),
        );
      }
    });
  }

  private async isValidWorkersForCreatingOrFail(
    indexedStations: NonEmptyArray<{
      stationWorkerId: number | null;
      index: number;
    }>,
  ): Promise<TStationsCreateItemWithWorker[]> {
    const stationsWithWorkers = indexedStations.filter(
      (item): item is TStationsCreateItemWithWorker => !!item.stationWorkerId,
    );

    if (isNonEmptyArray(stationsWithWorkers)) {
      const existingWorkers =
        await this.usersStationsWorkersRepository.getStationsWorkersOrFail(
          stationsWithWorkers,
        );
      this.stationsCheckWorkersService.workersCanBeAddToStationsOrFail(
        existingWorkers,
        stationsWithWorkers,
      );
    }

    return stationsWithWorkers;
  }

  private async updateStationsWorkers(
    stationsWithWorkers: TStationsCreateItemWithWorker[],
    createdStations: StationEntity[],
    repository: UsersStationsWorkersRepository,
  ) {
    const preparedStationsWorkers = stationsWithWorkers.map(
      ({ stationWorkerId, number }) => ({
        stationWorkerId,
        stationId: createdStations.find((station) => station.number === number)!
          .id,
      }),
    );

    await UsersStationsWorkersGeneralService.updateStationsOfStationsWorkers(
      preparedStationsWorkers,
      repository,
    );
  }
}
