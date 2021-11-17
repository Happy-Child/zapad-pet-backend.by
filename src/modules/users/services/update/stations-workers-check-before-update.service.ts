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
import { EntityManager } from 'typeorm';

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
    entityManager: EntityManager,
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

    const stationsWorkersRepository = entityManager.getCustomRepository(
      StationsWorkersRepository,
    );
    await this.canBeDeleteReplacedStationsAndDoItOrFail(
      groupedByStationId,
      foundWorkers,
      stationsWorkersRepository,
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
      workersToCheckExistingAndMatchingStationsWithClients,
      workersToCheckExistingClients,
    ] = this.getGroupedWorkersToCheckStationsAndClients(
      groupByClientId,
      groupByStationId,
      foundWorkers,
    );

    if (isNonEmptyArray(workersToCheckExistingAndMatchingStationsWithClients)) {
      const preparedStationsToCheckExisting = prepareWorkersToFetchStations(
        workersToCheckExistingAndMatchingStationsWithClients,
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
    const [workersToCheckExistingAndMatchingStationsWithClients] =
      this.getGroupedWorkersToCheckStationsAndClients(
        groupByClientId,
        groupByStationId,
        foundWorkers,
      );

    if (isNonEmptyArray(workersToCheckExistingAndMatchingStationsWithClients)) {
      const preparedStationsToCheckExisting = prepareWorkersToFetchStations(
        workersToCheckExistingAndMatchingStationsWithClients,
      );
      const foundStations =
        await this.stationsGeneralService.allStationsExistsOrFail(
          preparedStationsToCheckExisting,
        );

      this.stationsWorkersGeneralService.allStationsMatchOfClientsOrFail(
        foundStations.map(({ id, clientId }) => ({
          stationId: id,
          clientId,
        })),
        workersToCheckExistingAndMatchingStationsWithClients,
      );

      this.stationsWorkersGeneralService.allStationsWithoutWorkersExistingOrFail(
        foundStations.map(({ id, stationWorkerId }) => ({
          stationId: id,
          stationWorkerId,
        })),
        workersToCheckExistingAndMatchingStationsWithClients,
      );
    }
  }

  private getGroupedWorkersToCheckStationsAndClients(
    groupByClientId: TIndexedUsersUpdateStationWorkerDTO[],
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
  ): [
    (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId'> & {
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

    const workersToCheckExistingAndMatchingStationsWithClients = uniqBy(
      [
        ...workersReplacedClientsWithStations,
        ...groupByStationIdNextStates.added,
        ...groupByStationIdNextStates.replaced,
      ],
      'id',
    ) as (Omit<TIndexedUsersUpdateStationWorkerDTO, 'clientId'> & {
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
      workersToCheckExistingAndMatchingStationsWithClients,
      workersToCheckExistingClients,
    ];
  }

  private async canBeDeleteReplacedStationsAndDoItOrFail(
    groupByStationId: TIndexedUsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
    stationsWorkersRepository: StationsWorkersRepository,
  ): Promise<void> {
    const { deleted, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allWorkersCanBeChangeStationsOrFail(records);
      await stationsWorkersRepository.updateEntities(
        records.map(({ id }) => ({
          criteria: { userId: id },
          inputs: { stationId: null },
        })),
      );
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
