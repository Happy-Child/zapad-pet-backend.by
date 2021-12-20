import { Injectable } from '@nestjs/common';
import {
  StationExtendedDTO,
  StationsUpdateItemDTO,
  StationsUpdateRequestBodyDTO,
} from '../../dtos';
import {
  getIndexedArray,
  groupedByValueOfObjectKeyWillBe,
  groupedByChangedFields,
  isNonEmptyArray,
} from '@app/helpers';
import { StationsRepository } from '../../repositories';
import { Connection, EntityManager } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import { StationEntity, StationWorkerEntity } from '@app/entities';
import { StationsCheckBeforeUpdateService } from './stations-check-before-update.service';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import { GROUPED_UPDATING_STATIONS_FIELDS } from '../../constants';
import { NonEmptyArray } from '@app/types';
import { EntityFinderGeneralService } from '../../../entity-finder/services';

@Injectable()
export class StationsUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly stationsCheckBeforeUpdateService: StationsCheckBeforeUpdateService,
    private readonly connection: Connection,
  ) {}

  public async execute(
    data: StationsUpdateRequestBodyDTO,
  ): Promise<StationExtendedDTO[]> {
    const indexedStations = getIndexedArray(data.stations);

    const foundStations =
      await this.entityFinderGeneralService.allStationsExistsOrFail(
        indexedStations,
      );

    await this.stationsCheckBeforeUpdateService.executeOrFail(
      indexedStations,
      foundStations,
    );

    await this.connection.transaction(async (manager) => {
      await this.update(data.stations, foundStations, manager);
    });

    const ids = indexedStations.map(({ id }) => id) as NonEmptyArray<number>;
    return this.stationsRepository.getStationsByIds(ids);
  }

  private async update(
    stations: StationsUpdateItemDTO[],
    foundStations: StationExtendedDTO[],
    entityManager: EntityManager,
  ): Promise<void> {
    const stationsRepository =
      entityManager.getCustomRepository(StationsRepository);
    const stationsWorkersRepository = entityManager.getCustomRepository(
      StationsWorkersRepository,
    );

    await this.updateStations(stations, stationsRepository);

    const { stationWorkerId: groupByStationWorkerId } = groupedByChangedFields(
      stations,
      foundStations,
      GROUPED_UPDATING_STATIONS_FIELDS,
    );

    if (isNonEmptyArray(groupByStationWorkerId)) {
      await this.addedAndReplacedStationsWorkers(
        groupByStationWorkerId,
        foundStations,
        stationsWorkersRepository,
      );
    }
  }

  private async updateStations(
    stationsToUpdate: StationsUpdateItemDTO[],
    repository: StationsRepository,
  ): Promise<void> {
    const records: IRepositoryUpdateEntitiesItem<StationEntity>[] =
      stationsToUpdate.map(({ id, number, districtId, clientId }) => ({
        criteria: { id },
        inputs: { number, districtId, clientId },
      }));
    await repository.updateEntities(records);
  }

  private async addedAndReplacedStationsWorkers(
    groupByStationWorkerId: StationsUpdateItemDTO[],
    foundStations: StationExtendedDTO[],
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const { added, replaced, deleted } = groupedByValueOfObjectKeyWillBe(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const replacedIds = replaced.map(({ id }) => id);
    const preparedReplacedRecords = foundStations
      .filter(({ id }) => replacedIds.includes(id))
      .map(
        ({ stationWorkerId }) =>
          foundStations.find(
            (item) => item.stationWorkerId === stationWorkerId,
          )!,
      );
    const recordsToDelete = [...deleted, ...preparedReplacedRecords];

    if (isNonEmptyArray(recordsToDelete)) {
      const records: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
        recordsToDelete.map(({ id: stationId, clientId }) => ({
          criteria: { stationId, clientId },
          inputs: { stationId: null },
        }));
      await repository.updateEntities(records);
    }

    const addedAndReplaced = [...added, ...replaced];
    if (isNonEmptyArray(addedAndReplaced)) {
      const records: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
        addedAndReplaced.map(({ id, clientId, stationWorkerId: userId }) => ({
          criteria: { userId, clientId },
          inputs: { stationId: id },
        }));
      await repository.updateEntities(records);
    }
  }
}
