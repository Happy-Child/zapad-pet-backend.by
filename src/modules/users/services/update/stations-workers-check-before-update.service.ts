import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateStationWorkerDTO } from '../../dtos/users-update.dtos';
import { StationWorkerMemberDTO } from '../../dtos';
import {
  groupedByChangedFields,
  groupedByNextStateValues,
  groupedByNull,
} from '@app/helpers/grouped.helpers';
import {
  GROUPED_UPDATING_STATIONS_WORKERS_FIELDS,
  USERS_ERRORS,
} from '../../constants';
import { uniqBy } from 'lodash';
import { isNonEmptyArray } from '@app/helpers';
import { ClientsGeneralService } from '../../../clients/services';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import { BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION } from '../../../stations/constants';
import { BidEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsWorkersGeneralService } from '../../../stations-workers/services';
import { StationsGeneralService } from '../../../stations/services';

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
    const groupedWorkersToCheck = groupedByChangedFields(
      workers,
      foundWorkers,
      GROUPED_UPDATING_STATIONS_WORKERS_FIELDS,
    );

    await this.checkExistingClientsOrFail(
      groupedWorkersToCheck.clientId,
      foundWorkers,
    );

    await this.checkExistingStationsOrFail(
      groupedWorkersToCheck.stationId,
      foundWorkers,
    );

    await this.canBeDeleteReplacedStationsAndDoItOrFail(
      groupedWorkersToCheck.stationId,
      foundWorkers,
    );

    if (isNonEmptyArray(groupedWorkersToCheck.clientId)) {
      await this.canBeUpdateClientsOrFail(groupedWorkersToCheck.clientId);
    }

    await this.checkAddedAndReplacedStationsOrFail(
      groupedWorkersToCheck.clientId,
      groupedWorkersToCheck.stationId,
      foundWorkers,
    );
  }

  private async checkExistingStationsOrFail(
    groupByStationId: (UsersUpdateStationWorkerDTO & { index: number })[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const groupByStationIdNextStates = groupedByNextStateValues(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const addedAndReplacedStations = [
      ...groupByStationIdNextStates.added,
      ...groupByStationIdNextStates.replaced,
    ];

    if (isNonEmptyArray(addedAndReplacedStations)) {
      await this.stationsGeneralService.allStationsExistsOrFail(
        addedAndReplacedStations,
      );
    }
  }

  private async canBeDeleteReplacedStationsAndDoItOrFail(
    groupByStationId: (UsersUpdateStationWorkerDTO & { index: number })[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByNextStateValues(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allWorkersCanBeChangeStationsOrFail(records);
      await this.stationsWorkersRepository.updateEntities(
        records.map(({ id }) => ({
          criteria: { userId: id },
          inputs: { stationId: null },
        })),
      );
    }
  }

  private async allWorkersCanBeChangeStationsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
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
        { statuses: BID_STATUTES_BLOCKING_CHANGE_WORKER_ON_STATION },
      )
      .groupBy('sw.id')
      .getRawMany();

    const workersForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (workersForException.length) {
      const preparedErrors = getPreparedChildrenErrors(workersForException, {
        field: 'id',
        messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_STATION_FROM_WORKER],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  private async checkExistingClientsOrFail(
    groupByClientId: (UsersUpdateStationWorkerDTO & { index: number })[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const { added, replaced } = groupedByNextStateValues(
      groupByClientId,
      foundWorkers,
      'clientId',
    );

    const records = [...added, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.clientsGeneralService.allClientsExistsOrFail(records);
    }
  }

  private async canBeUpdateClientsOrFail(
    groupByClientId: (UsersUpdateStationWorkerDTO & { index: number })[],
  ): Promise<void> {
    const [groupByClientIdWithStations] = groupedByNull(
      groupByClientId,
      'stationId',
    );

    if (isNonEmptyArray(groupByClientIdWithStations)) {
      await this.stationsGeneralService.allStationsCanBeUpdateOrFail(
        groupByClientIdWithStations,
      );
    }
  }

  private async checkAddedAndReplacedStationsOrFail(
    groupByClientId: (UsersUpdateStationWorkerDTO & { index: number })[],
    groupByStationId: (UsersUpdateStationWorkerDTO & { index: number })[],
    foundWorkers: StationWorkerMemberDTO[],
  ): Promise<void> {
    const groupByClientIdNextStates = groupedByNextStateValues(
      groupByClientId,
      foundWorkers,
      'clientId',
    );
    const [addedClientsWithStations] = groupedByNull(
      groupByClientIdNextStates.added,
      'stationId',
    );
    const [replacedClientsWithStations] = groupedByNull(
      groupByClientIdNextStates.replaced,
      'stationId',
    );

    const groupByStationIdNextStates = groupedByNextStateValues(
      groupByStationId,
      foundWorkers,
      'stationId',
    );

    const addedAndReplacedStations = [
      ...groupByStationIdNextStates.added,
      ...groupByStationIdNextStates.replaced,
    ];
    const workersToCheckMatchClientsWithStations = uniqBy(
      [
        ...addedClientsWithStations,
        ...replacedClientsWithStations,
        ...addedAndReplacedStations,
      ],
      'id',
    );

    if (isNonEmptyArray(workersToCheckMatchClientsWithStations)) {
      const preparedWorkersToCheck = workersToCheckMatchClientsWithStations.map(
        ({ clientId, id, index }) => ({
          stationWorkerId: id,
          clientId,
          index,
        }),
      ) as unknown as NonEmptyArray<{
        stationWorkerId: number;
        clientId: number;
        index: number;
      }>;

      const foundStationsWorkers =
        await this.stationsWorkersGeneralService.allWorkersExistingAndMatchOfClientsOrFail(
          preparedWorkersToCheck,
        );

      if (isNonEmptyArray(addedAndReplacedStations)) {
        this.stationsWorkersGeneralService.allWorkersWithoutStationsExistingOrFail(
          foundStationsWorkers,
          preparedWorkersToCheck,
        );
      }
    }
  }
}
