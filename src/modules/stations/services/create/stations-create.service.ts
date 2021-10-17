import { Injectable } from '@nestjs/common';
import { StationsCreateRequestBodyDTO } from '../../dtos';
import { StationsCheckBeforeCreateService } from './stations-check-before-create.service';
import { Connection } from 'typeorm';
import { StationsRepository } from '../../repositories/stations.repository';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { UsersStationsWorkersRepository } from '../../../users/repositories';
import { TStationsCreateItemWithWorker } from '../../types';
import { UsersStationsWorkersGeneralService } from '../../../users/services';
import { StationEntity } from '@app/entities';
import { AggrStationBidStatusCountRepository } from '../../repositories/aggr-station-bid-status-count.repository';

@Injectable()
export class StationsCreateService {
  constructor(
    private readonly stationsCheckBeforeCreateService: StationsCheckBeforeCreateService,
    private readonly connection: Connection,
  ) {}

  public async create(data: StationsCreateRequestBodyDTO): Promise<void> {
    const indexedStations = getIndexedArray(data.stations);
    await this.stationsCheckBeforeCreateService.generalCheckOfStationsOrFail(
      indexedStations,
    );

    const stationsWithWorkers = indexedStations.filter(
      (item): item is TStationsCreateItemWithWorker => !!item.stationWorkerId,
    );
    if (isNonEmptyArray(stationsWithWorkers)) {
      await this.stationsCheckBeforeCreateService.checkStationsWorkersOrFail(
        stationsWithWorkers,
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

      const aggrStationRepository = manager.getCustomRepository(
        AggrStationBidStatusCountRepository,
      );
      await aggrStationRepository.saveEntities(
        createdStations.map(({ id }) => ({
          stationId: id,
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
