import { Injectable } from '@nestjs/common';
import {
  StationsUpdateItemDTO,
  StationsUpdateRequestBodyDTO,
  StationDTO,
} from '../dtos';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
import { StationsRepository } from '../repositories';
import { ClientsRepository } from '../../clients/repositories';
import { DistrictsRepository } from '../../districts/repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../constants/stations-errors.constants';
import { UsersStationsWorkersRepository } from '../../users/repositories';
import { StationsCheckWorkersService } from './general';

type TStationsUpdateItemWithWorker = Omit<
  StationsUpdateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: number;
  index: number;
};

type TRequiredStationsUpdateIndexedItem = Required<
  StationsUpdateItemDTO & { index: number }
>;

@Injectable()
export class StationsUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly districtsRepository: DistrictsRepository,
    private readonly stationsCheckWorkersService: StationsCheckWorkersService,
    private readonly usersStationsWorkersRepository: UsersStationsWorkersRepository,
  ) {}

  public async update(data: StationsUpdateRequestBodyDTO): Promise<void> {
    const indexedUpgradeableStations = getIndexedArray(data.stations);

    const existedStations = await this.stationsRepository.getStationsOrFail(
      indexedUpgradeableStations,
    );

    await this.isValidStationsNumbersOrFail(
      indexedUpgradeableStations,
      existedStations,
    );
    await this.isValidStationsClientsOrFail(
      indexedUpgradeableStations,
      existedStations,
    );
    await this.isValidStationsDistrictsOrFail(
      indexedUpgradeableStations,
      existedStations,
    );

    const stationsToCheckWorkers = this.getStationsWithChangedField(
      indexedUpgradeableStations,
      existedStations,
      'stationWorkerId',
    );
    await this.canRemoveCurrentWorkersFromStationsOrFail(
      stationsToCheckWorkers,
    );
    await this.isValidWorkersForUpdatingOrFail(stationsToCheckWorkers);

    // UPDATING
  }

  private async isValidStationsNumbersOrFail(
    indexedUpgradeableStations: (StationsUpdateItemDTO & { index: number })[],
    existedStations: StationDTO[],
  ): Promise<void> {
    const stationsToCheckNumbers = this.getStationsWithChangedField(
      indexedUpgradeableStations,
      existedStations,
      'number',
    );

    if (isNonEmptyArray(stationsToCheckNumbers)) {
      await this.stationsRepository.stationsNumbersNotExistsOrFail(
        stationsToCheckNumbers,
      );
    }
  }

  private async isValidStationsClientsOrFail(
    indexedUpgradeableStations: (StationsUpdateItemDTO & { index: number })[],
    existedStations: StationDTO[],
  ): Promise<void> {
    const stationsToCheckClients = this.getStationsWithChangedField(
      indexedUpgradeableStations,
      existedStations,
      'clientId',
    );

    if (isNonEmptyArray(stationsToCheckClients)) {
      await this.clientsRepository.clientsExistsOrFail(stationsToCheckClients);
    }
  }

  private async isValidStationsDistrictsOrFail(
    indexedUpgradeableStations: (StationsUpdateItemDTO & { index: number })[],
    existedStations: StationDTO[],
  ): Promise<void> {
    const stationsToCheckDistricts = this.getStationsWithChangedField(
      indexedUpgradeableStations,
      existedStations,
      'districtId',
    );

    if (isNonEmptyArray(stationsToCheckDistricts)) {
      await this.districtsRepository.districtsExistsOrFail(
        stationsToCheckDistricts,
      );
    }
  }

  private async canRemoveCurrentWorkersFromStationsOrFail(
    stationsToCheckWorkers: (StationsUpdateItemDTO & { index: number })[],
  ): Promise<void> {
    const ids = stationsToCheckWorkers.map(({ id }) => id);

    if (isNonEmptyArray(ids)) {
      const records =
        await this.stationsRepository.getStationsWithCountBidsOfNeedingWorkers(
          ids,
        );

      const stationsForException = stationsToCheckWorkers.filter((item) =>
        records.find(({ id, count }) => id === item.id && count > 0),
      );

      if (stationsForException.length) {
        const preparedErrors = getPreparedChildrenErrors(stationsForException, {
          field: 'stationWorkerId',
          messages: [STATIONS_ERRORS.IMPOSSIBLE_REMOVE_WORKER_FROM_STATION],
        });
        throw new ExceptionsUnprocessableEntity(preparedErrors);
      }
    }
  }

  private async isValidWorkersForUpdatingOrFail(
    stationsToCheckWorkers: (StationsUpdateItemDTO & { index: number })[],
  ): Promise<void> {
    const stationsWithWorkers = stationsToCheckWorkers.filter(
      (item): item is TStationsUpdateItemWithWorker => !!item.stationWorkerId,
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
  }

  private getStationsWithChangedField(
    indexedUpgradeableStations: (StationsUpdateItemDTO & { index: number })[],
    existedStations: StationDTO[],
    field: keyof StationsUpdateItemDTO,
  ): TRequiredStationsUpdateIndexedItem[] {
    return indexedUpgradeableStations.filter((item) =>
      existedStations.find(
        (itemX) => item.id === itemX.id && itemX[field] !== item[field],
      ),
    ) as TRequiredStationsUpdateIndexedItem[];
  }
}
