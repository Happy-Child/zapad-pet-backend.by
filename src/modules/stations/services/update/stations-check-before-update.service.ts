import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { StationsGeneralCheckingService } from '../general';
import { DistrictsGeneralCheckingService } from '../../../districts/services';
import { ClientsGeneralCheckingService } from '../../../clients/services';
import { NonEmptyArray } from '@app/types';
import {
  BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
  BID_STATUTES_BLOCKING_UPDATE_STATION,
  STATIONS_ERRORS,
} from '../../constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsRepository } from '../../repositories';
import { StationsWorkersGeneralService } from '../../../stations-workers/services';
import { IGetGroupedStationsByChangedFieldsReturn } from '../../interfaces';

@Injectable()
export class StationsCheckBeforeUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly stationsGeneralCheckingService: StationsGeneralCheckingService,
    private readonly districtsGeneralCheckingService: DistrictsGeneralCheckingService,
    private readonly clientsGeneralCheckingService: ClientsGeneralCheckingService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
  ) {}

  public async execute(
    groupedStationsToCheck: IGetGroupedStationsByChangedFieldsReturn,
  ): Promise<void> {
    const { byNumbers, byDistrictsIds, byClientsIds, byWorkersIds } =
      groupedStationsToCheck;

    const uniqueStationsByChangedFields = uniqBy(
      [...byNumbers, ...byDistrictsIds, ...byClientsIds],
      'id',
    );

    if (isNonEmptyArray(uniqueStationsByChangedFields)) {
      await this.allStationsCanBeUpdateOrFail(uniqueStationsByChangedFields);

      if (isNonEmptyArray(byNumbers))
        await this.stationsGeneralCheckingService.allStationsNumbersNotExistsOrFail(
          byNumbers,
        );
      if (isNonEmptyArray(byDistrictsIds))
        await this.districtsGeneralCheckingService.allDistrictsExistsOrFail(
          byDistrictsIds,
          'districtId',
        );
      if (isNonEmptyArray(byClientsIds))
        // Check existing clients and workers
        await this.clientsGeneralCheckingService.allClientsExistsOrFail(
          byClientsIds,
        );
    }

    const stationsWithWorkersToAddingAndReplacing = [
      ...byWorkersIds.toAdding,
      ...byWorkersIds.toReplacing,
    ];

    if (isNonEmptyArray(stationsWithWorkersToAddingAndReplacing)) {
      // Check existing clients and workers
      await this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
        stationsWithWorkersToAddingAndReplacing,
      );
      await this.allStationsCanBeChangeWorkersOrFail(
        stationsWithWorkersToAddingAndReplacing,
      );
    }
  }

  private async allStationsCanBeUpdateOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records =
      await this.stationsRepository.getStationsWithAggrBidsByStatuses(
        ids,
        BID_STATUTES_BLOCKING_UPDATE_STATION,
      );

    const stationsForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (stationsForException.length) {
      const preparedErrors = getPreparedChildrenErrors(stationsForException, {
        field: 'id',
        messages: [STATIONS_ERRORS.STATION_CANNOT_BE_UPDATED],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  private async allStationsCanBeChangeWorkersOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records =
      await this.stationsRepository.getStationsWithAggrBidsByStatuses(
        ids,
        BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
      );

    const stationsForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (stationsForException.length) {
      const preparedErrors = getPreparedChildrenErrors(stationsForException, {
        field: 'id',
        messages: [STATIONS_ERRORS.IMPOSSIBLE_REMOVE_WORKER_FROM_STATION],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
