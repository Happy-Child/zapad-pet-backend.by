import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { StationsGeneralService } from '../general';
import { DistrictsGeneralService } from '../../../districts/services';
import { ClientsGeneralService } from '../../../clients/services';
import { NonEmptyArray } from '@app/types';
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
import { EntityManager } from 'typeorm';

type TIndexedStationsUpdateItemDTO = StationsUpdateItemDTO & { index: number };

@Injectable()
export class StationsCheckBeforeUpdateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
  ) {}

  public async executeOrFail(
    stationsToCheck: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
    entityManager: EntityManager,
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

    const stationsWorkersRepository = entityManager.getCustomRepository(
      StationsWorkersRepository,
    );
    await this.canBeDeleteReplacedWorkersAndDoItOrFail(
      groupedByStationWorkerId,
      foundStations,
      stationsWorkersRepository,
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
      stationsToCheckExistingAndMatchingWorkersWithClients,
      stationsToCheckExistingClients,
    ] = this.getGroupedStationsToCheckWorkersAndClients(
      groupByClientsId,
      groupByStationWorkerId,
      foundStations,
    );

    if (isNonEmptyArray(stationsToCheckExistingAndMatchingWorkersWithClients)) {
      requestsToCheck.push(
        this.stationsWorkersGeneralService.allWorkersExistingOrFail(
          stationsToCheckExistingAndMatchingWorkersWithClients,
        ),
      );
    }

    if (isNonEmptyArray(stationsToCheckExistingClients)) {
      requestsToCheck.push(
        this.clientsGeneralService.allClientsExistsOrFail(
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
    const [stationsToCheckExistingAndMatchingWorkersWithClients] =
      this.getGroupedStationsToCheckWorkersAndClients(
        groupByClientsId,
        groupByStationWorkerId,
        foundStations,
      );

    if (isNonEmptyArray(stationsToCheckExistingAndMatchingWorkersWithClients)) {
      const foundStationsWorkers =
        await this.stationsWorkersGeneralService.allWorkersExistingOrFail(
          stationsToCheckExistingAndMatchingWorkersWithClients,
        );

      this.stationsWorkersGeneralService.allWorkersMatchOfClientsOrFail(
        foundStationsWorkers,
        stationsToCheckExistingAndMatchingWorkersWithClients,
      );

      this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
        foundStationsWorkers,
        stationsToCheckExistingAndMatchingWorkersWithClients,
      );
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
    TIndexedStationsUpdateItemDTO[],
  ] {
    const { replaced: stationsReplacedClients } = groupedByNextStateValues(
      groupByClientId,
      foundStations,
      'clientId',
    );

    const [
      stationsReplacedClientsWithStations,
      stationsReplacedClientsWithoutStations,
    ] = groupedByNull(stationsReplacedClients, 'stationWorkerId');

    const groupByWorkerIdNextStates = groupedByNextStateValues(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const stationsToCheckExistingAndMatchingWorkersWithClients = uniqBy(
      [
        ...stationsReplacedClientsWithStations,
        ...groupByWorkerIdNextStates.added,
        ...groupByWorkerIdNextStates.replaced,
      ],
      'id',
    ) as (Omit<TIndexedStationsUpdateItemDTO, 'stationWorkerId'> & {
      stationWorkerId: number;
    })[];

    return [
      stationsToCheckExistingAndMatchingWorkersWithClients,
      stationsReplacedClientsWithoutStations,
    ];
  }

  private async canBeDeleteReplacedWorkersAndDoItOrFail(
    groupByStationWorkerId: (StationsUpdateItemDTO & { index: number })[],
    foundStations: StationExtendedDTO[],
    stationsWorkersRepository: StationsWorkersRepository,
  ): Promise<void> {
    const { deleted, replaced } = groupedByNextStateValues(
      groupByStationWorkerId,
      foundStations,
      'stationWorkerId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allStationsCanBeChangeWorkersOrFail(records);
      await stationsWorkersRepository.updateEntities(
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
        await this.districtsGeneralService.allDistrictsExistsOrFail(
          groupByDistrictId,
          'districtId',
        );
    }
  }
}
