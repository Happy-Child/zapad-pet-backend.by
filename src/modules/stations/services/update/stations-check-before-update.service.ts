import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { StationsGeneralService } from '../general';
import { DistrictsGeneralService } from '../../../districts/services';
import { ClientsGeneralService } from '../../../clients/services';
import { NonEmptyArray, NonNullableObject } from '@app/types';
import {
  BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
  GROUPED_UPDATING_STATIONS_FIELDS,
  STATIONS_ERRORS,
} from '../../constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsRepository } from '../../repositories';
import { StationsWorkersGeneralService } from '../../../stations-workers/services';
import {
  groupedByChangedFields,
  groupedByNextStateValues,
  groupedByNull,
} from '@app/helpers/grouped.helpers';
import { StationExtendedDTO, StationsUpdateItemDTO } from '../../dtos';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';

type TIndexedStationsUpdateItemDTO = StationsUpdateItemDTO & { index: number };

@Injectable()
export class StationsCheckBeforeUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly stationsWorkersRepository: StationsWorkersRepository,
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
  ) {}

  public async executeOrFail(
    stationsToCheck: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const groupedStationsToCheck = groupedByChangedFields(
      stationsToCheck,
      foundStations,
      GROUPED_UPDATING_STATIONS_FIELDS,
    );

    if (Object.values(groupedStationsToCheck).length === 0) return;

    if (isNonEmptyArray(groupedStationsToCheck.clientId)) {
      await this.clientsGeneralService.allClientsExistsOrFail(
        groupedStationsToCheck.clientId,
      );
    }

    await this.checkExistingWorkersOrFail(
      groupedStationsToCheck.stationWorkerId,
      foundStations,
    );

    await this.canBeDeleteReplacedWorkersAndDoItOrFail(
      groupedStationsToCheck.stationWorkerId,
      foundStations,
    );

    await this.canChangeStationsGeneralFieldsOrFail(
      groupedStationsToCheck.number,
      groupedStationsToCheck.districtId,
      groupedStationsToCheck.clientId,
    );

    await this.checkAddedAndReplacedWorkersOrFail(
      groupedStationsToCheck.clientId,
      groupedStationsToCheck.stationWorkerId,
      foundStations,
    );
  }

  private async checkExistingWorkersOrFail(
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const { added, replaced } = groupedByNextStateValues(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const stationsToCheckMatchClientsWithWorkers = [...added, ...replaced];

    if (isNonEmptyArray(stationsToCheckMatchClientsWithWorkers)) {
      await this.stationsWorkersGeneralService.allWorkersExistingOrFail(
        stationsToCheckMatchClientsWithWorkers,
      );
    }
  }

  private async canBeDeleteReplacedWorkersAndDoItOrFail(
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByNextStateValues(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allStationsCanBeChangeWorkersOrFail(records);
      await this.stationsWorkersRepository.updateEntities(
        records.map(({ id, clientId }) => ({
          criteria: { stationId: id, clientId },
          inputs: { stationId: null },
        })),
      );
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

  private async canChangeStationsGeneralFieldsOrFail(
    groupByNumber: (StationsUpdateItemDTO & { index: number })[],
    groupByDistrictId: (StationsUpdateItemDTO & { index: number })[],
    groupByClientId: (StationsUpdateItemDTO & { index: number })[],
  ): Promise<void> {
    const uniqueStationsByChangedFields = uniqBy(
      [...groupByNumber, ...groupByDistrictId, ...groupByClientId],
      'id',
    );

    if (isNonEmptyArray(uniqueStationsByChangedFields)) {
      await this.stationsGeneralService.allStationsCanBeUpdateOrFail(
        uniqueStationsByChangedFields,
      );

      if (isNonEmptyArray(groupByNumber))
        await this.stationsGeneralService.allStationsNumbersNotExistsOrFail(
          groupByNumber,
        );
      if (isNonEmptyArray(groupByDistrictId))
        await this.districtsGeneralService.allDistrictsExistsOrFail(
          groupByDistrictId,
          'districtId',
        );
    }
  }

  private async checkAddedAndReplacedWorkersOrFail(
    groupByClientsId: (StationsUpdateItemDTO & { index: number })[],
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const [groupByClientsIdWithWorkers] = groupedByNull(
      groupByClientsId,
      'stationWorkerId',
    ) as [NonNullableObject<TIndexedStationsUpdateItemDTO>[], unknown[]];

    const { added, replaced } = groupedByNextStateValues(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const addedAndReplacedWorkers = [...added, ...replaced];
    const stationsToCheckMatchClientsWithWorkers = uniqBy(
      [...addedAndReplacedWorkers, ...groupByClientsIdWithWorkers],
      'id',
    );

    if (isNonEmptyArray(stationsToCheckMatchClientsWithWorkers)) {
      const foundStationsWorkers =
        await this.stationsWorkersGeneralService.allWorkersExistingAndMatchOfClientsOrFail(
          stationsToCheckMatchClientsWithWorkers,
        );

      if (isNonEmptyArray(addedAndReplacedWorkers)) {
        this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
          foundStationsWorkers,
          addedAndReplacedWorkers,
        );
      }
    }
  }
}
