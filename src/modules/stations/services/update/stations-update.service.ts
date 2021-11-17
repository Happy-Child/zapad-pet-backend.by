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
import { StationsGeneralService } from '../general';
import { StationsRepository } from '../../repositories';
import { Connection, EntityManager } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import { StationEntity, StationWorkerEntity } from '@app/entities';
import { StationsCheckBeforeUpdateService } from './stations-check-before-update.service';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
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

    await this.connection.transaction(async (manager) => {
      await this.stationsCheckBeforeUpdateService.executeOrFail(
        stationsToCheck,
        foundStations,
        manager,
      );
      await this.update(data.stations, foundStations, manager);
    });
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
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationEntity>[] =
      stationsToUpdate.map(({ id, number, districtId, clientId }) => ({
        criteria: { id },
        inputs: { number, districtId, clientId },
      }));
    await repository.updateEntities(recordsToUpdate);
  }

  private async addedAndReplacedStationsWorkers(
    groupByStationWorkerId: StationsUpdateItemDTO[],
    foundStations: StationExtendedDTO[],
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const { added, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const addedAndReplaced = [...added, ...replaced];

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
      [];

    // TODO delete "stationId" implement on stage of data checking before saving (stationsCheckBeforeUpdateService.executeOrFail)

    if (isNonEmptyArray(addedAndReplaced)) {
      const records = addedAndReplaced.map(
        ({ id, clientId, stationWorkerId: userId }) => ({
          criteria: { userId, clientId },
          inputs: { stationId: id },
        }),
      );
      recordsToUpdate.push(...records);
    }

    await repository.updateEntities(recordsToUpdate);
  }
}
