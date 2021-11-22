import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateStationWorkerDTO } from '../../dtos/users-update.dtos';
import { StationWorkerMemberDTO } from '../../dtos';
import {
  groupedByChangedFields,
  groupedByNull,
  groupedByValueOfObjectKeyWillBe,
} from '@app/helpers/grouped.helpers';
import {
  GROUPED_UPDATING_STATIONS_WORKERS_FIELDS,
  USERS_ERRORS,
} from '../../constants';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { ClientsGeneralService } from '../../../clients/services';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import {
  BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
  BID_STATUTES_BLOCKING_UPDATE_STATION,
} from '../../../stations/constants';
import { BidEntity } from '@app/entities';
import {
  getPreparedChildrenErrors,
  IGetPreparedChildrenErrorsParams,
} from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsWorkersGeneralService } from '../../../stations-workers/services';
import { StationsGeneralService } from '../../../stations/services';
import { BID_STATUS } from '../../../bids/constants';

type TIndexedUsersUpdateStationWorkerDTO = UsersUpdateStationWorkerDTO & {
  index: number;
};

const prepareWorkersToFetchStations = (
  items: Pick<TIndexedUsersUpdateStationWorkerDTO, 'stationId' | 'index'>[],
) =>
  items.map(({ stationId, index }) => ({
    id: stationId,
    index,
  })) as NonEmptyArray<{ id: number; index: number }>;

@Injectable()
export class StationsWorkersCheckBeforeUpdateService {
  constructor(
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly stationsWorkersRepository: StationsWorkersRepository,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
    private readonly stationsGeneralService: StationsGeneralService,
  ) {}

  public async executeOrFail(
    workers: NonEmptyArray<UsersUpdateStationWorkerDTO & { index: number }>,
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const { clientId: groupedByClientId, stationId: groupedByStationId } =
      groupedByChangedFields(
        workers,
        foundWorkers,
        GROUPED_UPDATING_STATIONS_WORKERS_FIELDS,
      );

    await this.canBeUpdateClientsOrFail(groupedByClientId);

    await this.checkExistingStationsAndClientsOrFail(
      groupedByClientId,
      groupedByStationId,
      foundWorkers,
    );

    await this.canBeDeleteReplacedStationsOrFail(
      groupedByStationId,
      foundWorkers,
    );

    await this.checkMatchingStationsAndClientsOrFail(
      groupedByClientId,
      groupedByStationId,
      foundWorkers,
    );
  }

  private async checkExistingStationsAndClientsOrFail(
    groupByClientId: TIndexedUsersUpdateStationWorkerDTO[],
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const requestsToCheck: Promise<any>[] = [];

    const [
      workersToCheckMatchingStationsWithClients,
      _,
      workersToCheckExistingClients,
    ] = this.getGroupedWorkersToCheckStationsAndClients(
      groupByClientId,
      groupByStationId,
      foundWorkers,
    );

    if (isNonEmptyArray(workersToCheckMatchingStationsWithClients)) {
      const preparedStationsToCheckExisting = prepareWorkersToFetchStations(
        workersToCheckMatchingStationsWithClients,
      );

      requestsToCheck.push(
        this.stationsGeneralService.allStationsExistsOrFail(
          preparedStationsToCheckExisting,
        ),
      );
    }

    if (isNonEmptyArray(workersToCheckExistingClients)) {
      requestsToCheck.push(
        this.clientsGeneralService.allClientsExistsOrFail(
          workersToCheckExistingClients,
        ),
      );
    }

    await Promise.all(requestsToCheck);
  }

  private async checkMatchingStationsAndClientsOrFail(
    groupByClientId: TIndexedUsersUpdateStationWorkerDTO[],
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const [
      workersToCheckMatchingStationsWithClients,
      workersToCheckEmptyStations,
    ] = this.getGroupedWorkersToCheckStationsAndClients(
      groupByClientId,
      groupByStationId,
      foundWorkers,
    );

    if (isNonEmptyArray(workersToCheckMatchingStationsWithClients)) {
      const preparedStationsToCheckExisting = prepareWorkersToFetchStations(
        workersToCheckMatchingStationsWithClients,
      );
      const foundStations =
        await this.stationsGeneralService.allStationsExistsOrFail(
          preparedStationsToCheckExisting,
        );
      const preparedStations = foundStations.map(
        ({ id, clientId, stationWorkerId }) => ({
          stationId: id,
          clientId,
          stationWorkerId,
        }),
      );

      this.stationsWorkersGeneralService.allStationsMatchOfClientsOrFail(
        preparedStations,
        workersToCheckMatchingStationsWithClients,
      );

      if (isNonEmptyArray(workersToCheckEmptyStations)) {
        const stationsIds = workersToCheckEmptyStations.map(
          ({ stationId }) => stationId,
        );
        const filteredStations = preparedStations.filter(({ stationId }) =>
          stationsIds.includes(stationId),
        );
        this.stationsWorkersGeneralService.allStationsWithoutWorkersExistingOrFail(
          filteredStations,
          workersToCheckEmptyStations,
        );
      }
    }
  }

  private getGroupedWorkersToCheckStationsAndClients(
    groupByClientId: TIndexedUsersUpdateStationWorkerDTO[],
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
  ): [
    (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId' | 'stationId'> & {
      clientId: number;
      stationId: number;
    })[],
    (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId' | 'stationId'> & {
      clientId: number;
      stationId: number;
    })[],
    (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId'> & {
      clientId: number;
    })[],
  ] {
    const groupByClientIdNextStates = groupedByValueOfObjectKeyWillBe(
      groupByClientId,
      foundWorkers,
      'clientId',
    );

    const groupByStationIdNextStates = groupedByValueOfObjectKeyWillBe(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const [_, workersAddedClientsWithoutStations] = groupedByNull(
      groupByClientIdNextStates.added,
      'stationId',
    );

    const [
      workersReplacedClientsWithStations,
      workersReplacedClientsWithoutStations,
    ] = groupedByNull(groupByClientIdNextStates.replaced, 'stationId');

    const workersToCheckMatchingStationsWithClients = uniqBy(
      [
        ...workersReplacedClientsWithStations,
        ...groupByStationIdNextStates.added,
        ...groupByStationIdNextStates.replaced,
      ],
      'id',
    ) as (Omit<
      TIndexedUsersUpdateStationWorkerDTO,
      'clientId' | 'stationId'
    > & {
      clientId: number;
      stationId: number;
    })[];

    const workersToCheckEmptyStations = [
      ...groupByStationIdNextStates.added,
      ...groupByStationIdNextStates.replaced,
    ].filter((worker) => {
      const foundWorkerByStationId = foundWorkers.find(
        ({ stationId }) => worker.stationId === stationId,
      );

      if (!foundWorkerByStationId) return true;

      const foundWorkerBeChange = !![
        ...groupByStationIdNextStates.deleted,
        ...groupByStationIdNextStates.replaced,
      ].find(({ id }) => foundWorkerByStationId.id === id);

      return !foundWorkerBeChange;
    }) as (Omit<
      TIndexedUsersUpdateStationWorkerDTO,
      'clientId' | 'stationId'
    > & {
      clientId: number;
      stationId: number;
    })[];

    const workersToCheckExistingClients = [
      ...workersAddedClientsWithoutStations,
      ...workersReplacedClientsWithoutStations,
    ] as (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId'> & {
      clientId: number;
    })[];

    return [
      workersToCheckMatchingStationsWithClients,
      workersToCheckEmptyStations,
      workersToCheckExistingClients,
    ];
  }

  private async canBeDeleteReplacedStationsOrFail(
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allWorkersCanBeChangeStationsOrFail(records);
    }
  }

  private async canBeUpdateClientsOrFail(
    groupByClientId: TIndexedUsersUpdateStationWorkerDTO[],
  ): Promise<void> {
    const [groupByClientIdWithStations] = groupedByNull(
      groupByClientId,
      'stationId',
    ) as [
      (Omit<TIndexedUsersUpdateStationWorkerDTO, 'stationId'> & {
        stationId: number;
      })[],
      any[],
    ];

    if (isNonEmptyArray(groupByClientIdWithStations)) {
      await this.allWorkersCanBeChangeClientsOrFail(
        groupByClientIdWithStations,
      );
    }
  }

  private async allWorkersCanBeChangeStationsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    await this.allWorkersNotHaveBidsWithStatusesOrFail(
      items,
      BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION,
    );
  }

  private async allWorkersCanBeChangeClientsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    await this.allWorkersNotHaveBidsWithStatusesOrFail(
      items,
      BID_STATUTES_BLOCKING_UPDATE_STATION,
    );
  }

  private async allWorkersNotHaveBidsWithStatusesOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    statuses: BID_STATUS[],
    errorConfig: IGetPreparedChildrenErrorsParams = {
      field: 'id',
      messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_STATION_FROM_WORKER],
    },
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records = await this.stationsWorkersRepository
      .createQueryBuilder('sw')
      .select('sw.id as id, COUNT(b.id)::int AS count')
      .where('sw.id IN (:...ids)', { ids })
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = "sw"."stationId" AND b.status IN (:...statuses)`,
        { statuses },
      )
      .groupBy('sw.id')
      .getRawMany();

    const workersForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (workersForException.length) {
      const preparedErrors = getPreparedChildrenErrors(
        workersForException,
        errorConfig,
      );
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
