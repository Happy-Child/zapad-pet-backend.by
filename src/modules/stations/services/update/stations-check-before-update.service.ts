import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { StationsGeneralService } from '../general';
import { NonEmptyArray } from '@app/types';
import {
  BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
  GROUPED_UPDATING_STATIONS_FIELDS,
} from '../../constants';
import { STATIONS_ERRORS } from '@app/constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsRepository } from '../../repositories';
import {
  groupedByChangedFields,
  groupedByValueOfObjectKeyWillBe,
  groupedByNull,
} from '@app/helpers/grouped.helpers';
import { StationExtendedDTO, StationsUpdateItemDTO } from '../../dtos';
import { EntityFinderGeneralService } from '../../../entity-finder/services';
import { StationsUpdateHelpersService } from './stations-update-helpers.service';

type TIndexedStationsUpdateItemDTO = StationsUpdateItemDTO & { index: number };

@Injectable()
export class StationsCheckBeforeUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly stationsUpdateHelpersService: StationsUpdateHelpersService,
  ) {}

  public async executeOrFail(
    stationsToCheck: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const {
      number: groupedByNumber,
      districtId: groupedByDistrictId,
      clientId: groupedByClientId,
      stationWorkerId: groupedByStationWorkerId,
    } = groupedByChangedFields(
      stationsToCheck,
      foundStations,
      GROUPED_UPDATING_STATIONS_FIELDS,
    );

    await this.canBeChangeGeneralFieldsOrFail(
      groupedByNumber,
      groupedByDistrictId,
      groupedByClientId,
    );

    await this.checkExistingWorkersAndClientsOrFail(
      groupedByClientId,
      groupedByStationWorkerId,
      foundStations,
    );

    await this.canBeDeleteReplacedWorkersOrFail(
      groupedByStationWorkerId,
      foundStations,
    );

    await this.checkMatchingWorkersAndClientsOrFail(
      groupedByClientId,
      groupedByStationWorkerId,
      foundStations,
    );
  }

  private async checkExistingWorkersAndClientsOrFail(
    groupByClientsId: (StationsUpdateItemDTO & { index: number })[],
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const requestsToCheck: Promise<any>[] = [];

    const [
      stationsToCheckMatchingWorkersWithClients,
      _,
      stationsToCheckExistingClients,
    ] = this.getGroupedStationsToCheckWorkersAndClients(
      groupByClientsId,
      groupByStationWorkerId,
      foundStations,
    );

    if (isNonEmptyArray(stationsToCheckMatchingWorkersWithClients)) {
      requestsToCheck.push(
        this.entityFinderGeneralService.allWorkersExistingOrFail(
          stationsToCheckMatchingWorkersWithClients,
        ),
      );
    }

    if (isNonEmptyArray(stationsToCheckExistingClients)) {
      requestsToCheck.push(
        this.entityFinderGeneralService.allClientsExistsOrFail(
          stationsToCheckExistingClients,
        ),
      );
    }

    await Promise.all(requestsToCheck);
  }

  private async checkMatchingWorkersAndClientsOrFail(
    groupByClientsId: (StationsUpdateItemDTO & { index: number })[],
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const [
      stationsToCheckMatchingWorkersWithClients,
      stationsToCheckEmptyWorkers,
    ] = this.getGroupedStationsToCheckWorkersAndClients(
      groupByClientsId,
      groupByStationWorkerId,
      foundStations,
    );

    if (isNonEmptyArray(stationsToCheckMatchingWorkersWithClients)) {
      const foundStationsWorkers =
        await this.entityFinderGeneralService.allWorkersExistingOrFail(
          stationsToCheckMatchingWorkersWithClients,
        );

      this.stationsUpdateHelpersService.allWorkersMatchOfClientsOrFail(
        foundStationsWorkers,
        stationsToCheckMatchingWorkersWithClients,
      );

      if (isNonEmptyArray(stationsToCheckEmptyWorkers)) {
        const workersIds = stationsToCheckEmptyWorkers.map(
          ({ stationWorkerId }) => stationWorkerId,
        );
        const filteredWorkers = foundStationsWorkers.filter(({ id }) =>
          workersIds.includes(id),
        );
        this.stationsUpdateHelpersService.allWorkersWithoutStationsOrFail(
          filteredWorkers,
          stationsToCheckEmptyWorkers,
        );
      }
    }
  }

  private getGroupedStationsToCheckWorkersAndClients(
    groupByClientId: (StationsUpdateItemDTO & { index: number })[],
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): [
    (Omit<TIndexedStationsUpdateItemDTO, 'stationWorkerId'> & {
      stationWorkerId: number;
    })[],
    (Omit<TIndexedStationsUpdateItemDTO, 'stationWorkerId'> & {
      stationWorkerId: number;
    })[],
    TIndexedStationsUpdateItemDTO[],
  ] {
    const { replaced: stationsReplacedClients } =
      groupedByValueOfObjectKeyWillBe(
        groupByClientId,
        foundStations,
        'clientId',
      );

    const [
      stationsReplacedClientsWithStations,
      stationsReplacedClientsWithoutStations,
    ] = groupedByNull(stationsReplacedClients, 'stationWorkerId');

    const groupByWorkerIdNextStates = groupedByValueOfObjectKeyWillBe(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const stationsToCheckMatchingWorkersWithClients = uniqBy(
      [
        ...stationsReplacedClientsWithStations,
        ...groupByWorkerIdNextStates.added,
        ...groupByWorkerIdNextStates.replaced,
      ],
      'id',
    ) as (Omit<TIndexedStationsUpdateItemDTO, 'stationWorkerId'> & {
      clientId: number;
      stationWorkerId: number;
    })[];

    const stationsToCheckEmptyWorkers = [
      ...groupByWorkerIdNextStates.added,
      ...groupByWorkerIdNextStates.replaced,
    ].filter((station) => {
      const foundStationByWorkerId = foundStations.find(
        ({ stationWorkerId }) => station.stationWorkerId === stationWorkerId,
      );

      if (!foundStationByWorkerId) return true;

      const foundStationBeChange = !![
        ...groupByWorkerIdNextStates.deleted,
        ...groupByWorkerIdNextStates.replaced,
      ].find(({ id }) => foundStationByWorkerId.id === id);

      return !foundStationBeChange;
    }) as (Omit<TIndexedStationsUpdateItemDTO, 'stationWorkerId'> & {
      clientId: number;
      stationWorkerId: number;
    })[];

    const stationsToCheckExistingClients = [
      ...stationsReplacedClientsWithoutStations,
    ];

    return [
      stationsToCheckMatchingWorkersWithClients,
      stationsToCheckEmptyWorkers,
      stationsToCheckExistingClients,
    ];
  }

  private async canBeDeleteReplacedWorkersOrFail(
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allStationsCanBeChangeWorkersOrFail(records);
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

  private async canBeChangeGeneralFieldsOrFail(
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
        await this.entityFinderGeneralService.allDistrictsExistsOrFail(
          groupByDistrictId,
          'districtId',
        );
    }
  }
}
