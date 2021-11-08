import { Injectable } from '@nestjs/common';
import {
  StationExtendedDTO,
  StationsUpdateItemDTO,
  StationsUpdateRequestBodyDTO,
} from '../../dtos';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { StationsGeneralService } from '../general';
import { StationsRepository } from '../../repositories';
import { Connection } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import { StationEntity, StationWorkerEntity } from '@app/entities';
import { StationsCheckBeforeUpdateService } from './stations-check-before-update.service';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import { NonNullableObject } from '@app/types';
import {
  groupedByChangedFields,
  groupedByNextStateValues,
} from '@app/helpers/grouped.helpers';
import { GROUPED_UPDATING_STATIONS_FIELDS } from '../../constants';

@Injectable()
export class StationsUpdateService {
  constructor(
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly stationsCheckBeforeUpdateService: StationsCheckBeforeUpdateService,
    private readonly connection: Connection,
  ) {}

  public async execute(data: StationsUpdateRequestBodyDTO): Promise<void> {
    const stationsToCheck = getIndexedArray(data.stations);

    const foundStations =
      await this.stationsGeneralService.allStationsExistsOrFail(
        stationsToCheck,
      );

    await this.stationsCheckBeforeUpdateService.executeOrFail(
      stationsToCheck,
      foundStations,
    );

    await this.update(data.stations, foundStations);
  }

  private async update(
    stations: StationsUpdateItemDTO[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const stationsRepository =
        manager.getCustomRepository(StationsRepository);
      await this.updateStations(stations, stationsRepository);

      const { stationWorkerId: groupByStationWorkerId } =
        groupedByChangedFields(
          stations,
          foundStations,
          GROUPED_UPDATING_STATIONS_FIELDS,
        );

      if (isNonEmptyArray(groupByStationWorkerId)) {
        const stationsWorkersRepository = manager.getCustomRepository(
          StationsWorkersRepository,
        );
        const { added, replaced } = groupedByNextStateValues(
          groupByStationWorkerId,
          foundStations,
          'stationWorkerId',
        );
        await this.addedAndReplacedStationsWorkers(
          added,
          replaced,
          stationsWorkersRepository,
        );
      }
    });
  }

  private async updateStations(
    stationsToUpdate: StationsUpdateItemDTO[],
    repository: StationsRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationEntity>[] =
      stationsToUpdate.map(({ id, number, districtId, clientId }) => ({
        criteria: { id },
        inputs: { number, districtId, clientId },
      }));
    await repository.updateEntities(recordsToUpdate);
  }

  private async addedAndReplacedStationsWorkers(
    added: NonNullableObject<StationsUpdateItemDTO>[],
    replaced: NonNullableObject<StationsUpdateItemDTO>[],
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
      [];

    if (isNonEmptyArray(replaced)) {
      recordsToUpdate.push(
        ...replaced.map(({ id, clientId, stationWorkerId }) => ({
          criteria: { userId: stationWorkerId, clientId },
          inputs: { stationId: id },
        })),
      );
    }
    if (isNonEmptyArray(added)) {
      recordsToUpdate.push(
        ...added.map(({ id, clientId, stationWorkerId }) => ({
          criteria: { userId: stationWorkerId, clientId },
          inputs: { stationId: id },
        })),
      );
    }

    await repository.updateEntities(recordsToUpdate);
  }
}
