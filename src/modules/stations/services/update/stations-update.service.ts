import { Injectable } from '@nestjs/common';
import {
  StationExtendedDTO,
  StationsUpdateItemDTO,
  StationsUpdateRequestBodyDTO,
} from '../../dtos';
import { getIndexedArray, isNonEmptyArray, isNull } from '@app/helpers';
import { StationsGeneralCheckingService } from '../general';
import { StationsRepository } from '../../repositories';
import { Connection } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import { StationEntity, StationWorkerEntity } from '@app/entities';
import { StationsCheckBeforeUpdateService } from './stations-check-before-update.service';
import {
  TIndexedStationsUpdateItemDTO,
  TStationsUpdateItemWithoutWorker,
  TStationsUpdateItemWithWorker,
} from '../../types';
import {
  IGetGroupedStationsByChangedFieldsReturn,
  IGetGroupedStationsByChangedWorkers,
} from '../../interfaces';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';

@Injectable()
export class StationsUpdateService {
  constructor(
    private readonly stationsGeneralCheckingService: StationsGeneralCheckingService,
    private readonly stationsCheckBeforeUpdateService: StationsCheckBeforeUpdateService,
    private readonly connection: Connection,
  ) {}

  public async update(data: StationsUpdateRequestBodyDTO): Promise<void> {
    const stationsToCheck = getIndexedArray(data.stations);

    const foundStations =
      await this.stationsGeneralCheckingService.allStationsExistsOrFail(
        stationsToCheck,
      );

    const groupedStationsToCheck = this.getGroupedStationsByChangedFields(
      stationsToCheck,
      foundStations,
    );

    if (!this.someStationHasBeenChanged(groupedStationsToCheck)) return;

    await this.stationsCheckBeforeUpdateService.execute(groupedStationsToCheck);

    await this.connection.transaction(async (manager) => {
      const stationsRepository =
        manager.getCustomRepository(StationsRepository);
      await this.updateStations(data.stations, stationsRepository);

      const hasUpdatesByWorkers = isNonEmptyArray(
        Object.values(groupedStationsToCheck.byWorkersIds).flat(1),
      );
      if (hasUpdatesByWorkers) {
        const stationsWorkersRepository = manager.getCustomRepository(
          StationsWorkersRepository,
        );
        await this.updateStationsWorkers(
          groupedStationsToCheck.byWorkersIds,
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

  private async updateStationsWorkers(
    groupedStationsByChangedWorkers: IGetGroupedStationsByChangedWorkers,
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const { toAdding, toReplacing, toRemoving } =
      groupedStationsByChangedWorkers;
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
      [];

    if (isNonEmptyArray(toReplacing)) {
      await repository.updateEntities(
        toReplacing.map(({ id, clientId }) => ({
          criteria: { stationId: id, clientId },
          inputs: { stationId: null },
        })),
      );
      recordsToUpdate.push(
        ...toReplacing.map(({ id, clientId, stationWorkerId }) => ({
          criteria: { userId: stationWorkerId, clientId },
          inputs: { stationId: id },
        })),
      );
    }
    if (isNonEmptyArray(toAdding)) {
      recordsToUpdate.push(
        ...toAdding.map(({ id, clientId, stationWorkerId }) => ({
          criteria: { userId: stationWorkerId, clientId },
          inputs: { stationId: id },
        })),
      );
    }
    if (isNonEmptyArray(toRemoving)) {
      recordsToUpdate.push(
        ...toRemoving.map(({ id, clientId }) => ({
          criteria: { stationId: id, clientId },
          inputs: { stationId: null },
        })),
      );
    }

    await repository.updateEntities(recordsToUpdate);
  }

  private someStationHasBeenChanged({
    byNumbers,
    byDistrictsIds,
    byClientsIds,
    byWorkersIds,
  }: IGetGroupedStationsByChangedFieldsReturn): boolean {
    return (
      [
        ...byNumbers,
        ...byDistrictsIds,
        ...byClientsIds,
        ...Object.values(byWorkersIds),
      ].flat(2).length > 0
    );
  }

  private getGroupedStationsByChangedFields(
    stationsToCheck: TIndexedStationsUpdateItemDTO[],
    foundStations: StationExtendedDTO[],
  ): IGetGroupedStationsByChangedFieldsReturn {
    const isWorkerToRemoving = (
      { stationWorkerId: workerIdToCheck }: StationsUpdateItemDTO,
      { stationWorkerId: curWorkerId }: StationsUpdateItemDTO,
    ): boolean => isNull(workerIdToCheck) && typeof curWorkerId === 'number';

    const isWorkerToAdding = (
      { stationWorkerId: workerIdToCheck }: StationsUpdateItemDTO,
      { stationWorkerId: curWorkerId }: StationsUpdateItemDTO,
    ): boolean => isNull(curWorkerId) && typeof workerIdToCheck === 'number';

    const isWorkerToReplacing = (
      { stationWorkerId: workerIdToCheck }: StationsUpdateItemDTO,
      { stationWorkerId: curWorkerId }: StationsUpdateItemDTO,
    ): boolean =>
      typeof workerIdToCheck === 'number' && typeof curWorkerId === 'number';

    const byNumbers: TIndexedStationsUpdateItemDTO[] = [];
    const byDistrictsIds: TIndexedStationsUpdateItemDTO[] = [];
    const byClientsIds: TIndexedStationsUpdateItemDTO[] = [];
    const byWorkersIds: IGetGroupedStationsByChangedWorkers = {
      toRemoving: [],
      toAdding: [],
      toReplacing: [],
    };

    stationsToCheck.forEach((stationToCheck) => {
      const curStation = foundStations.find(
        ({ id }) => stationToCheck.id === id,
      )!;

      if (stationToCheck.number !== curStation.number)
        byNumbers.push(stationToCheck);
      if (stationToCheck.districtId !== curStation.districtId)
        byDistrictsIds.push(stationToCheck);
      if (stationToCheck.clientId !== curStation.clientId)
        byClientsIds.push(stationToCheck);

      if (stationToCheck.stationWorkerId !== curStation.stationWorkerId) {
        if (isWorkerToRemoving(stationToCheck, curStation))
          byWorkersIds.toRemoving.push(
            stationToCheck as TStationsUpdateItemWithoutWorker,
          );
        else if (isWorkerToAdding(stationToCheck, curStation))
          byWorkersIds.toAdding.push(
            stationToCheck as TStationsUpdateItemWithWorker,
          );
        else if (isWorkerToReplacing(stationToCheck, curStation))
          byWorkersIds.toReplacing.push(
            stationToCheck as TStationsUpdateItemWithWorker,
          );
      }
    });

    return {
      byNumbers,
      byDistrictsIds,
      byClientsIds,
      byWorkersIds,
    };
  }
}
