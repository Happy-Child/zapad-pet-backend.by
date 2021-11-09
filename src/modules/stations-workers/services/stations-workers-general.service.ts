import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { StationWorkerEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../../stations/constants';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { isNull } from '@app/helpers';
import { StationsWorkersRepository } from '../repositories';

@Injectable()
export class StationsWorkersGeneralService {
  constructor(
    private readonly stationsWorkersRepository: StationsWorkersRepository,
  ) {}

  public async allWorkersExistingOrFail(
    workers: NonEmptyArray<{ stationWorkerId: number; index: number }>,
    exceptionField = 'stationWorkerId',
  ): Promise<NonEmptyArray<StationWorkerEntity>> {
    const workersIds = workers.map(
      ({ stationWorkerId }) => stationWorkerId,
    ) as NonEmptyArray<number>;

    const foundRecords = await this.stationsWorkersRepository.getManyByColumn(
      workersIds,
      'userId',
    );

    const allIdsExisting = workersIds.length === foundRecords.length;

    if (!allIdsExisting) {
      const recordsIds = foundRecords.map(({ userId }) => userId);
      const result = workers.filter(
        (item) => !recordsIds.includes(item.stationWorkerId),
      );

      const preparedErrors = getPreparedChildrenErrors(result, {
        field: exceptionField,
        messages: [STATIONS_ERRORS.STATION_WORKER_NOT_EXIST],
      });
      throw new ExceptionsNotFound(preparedErrors);
    }

    return foundRecords as NonEmptyArray<StationWorkerEntity>;
  }

  public async allWorkersExistingAndMatchOfClientsOrFail(
    recordsToCheck: NonEmptyArray<{
      stationWorkerId: number;
      clientId: number;
      index: number;
    }>,
  ): Promise<StationWorkerEntity[]> {
    const workers = await this.allWorkersExistingOrFail(recordsToCheck);
    this.allWorkersMatchOfClientsOrFail(workers, recordsToCheck);
    return workers;
  }

  public allWorkersMatchOfClientsOrFail(
    foundWorkers: { userId: number; clientId: number }[],
    workersToCheck: {
      stationWorkerId: number;
      clientId: number;
      index: number;
    }[],
  ): void {
    const workersWithInvalidClients = workersToCheck.filter(
      ({ stationWorkerId, clientId }) =>
        !foundWorkers.find(
          (item) =>
            item.userId === stationWorkerId && item.clientId === clientId,
        ),
    );

    if (workersWithInvalidClients.length === 0) return;

    const preparedErrors = getPreparedChildrenErrors(
      workersWithInvalidClients,
      {
        field: 'clientId',
        messages: [STATIONS_ERRORS.CLIENT_NOT_EXISTS_OR_DONT_HAVE_THIS_WORKER],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public allWorkersWithoutStationsExistingOrFail(
    foundWorkers: { userId: number; stationId: number | null }[],
    workersToCheck: { stationWorkerId: number; index: number }[],
  ): void {
    const workersWithStations = foundWorkers.filter(
      ({ stationId }) => !isNull(stationId),
    );

    if (workersWithStations.length === 0) return;

    const result = workersToCheck.filter(({ stationWorkerId }) =>
      workersWithStations.find((item) => item.userId === stationWorkerId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationWorkerId',
      messages: [STATIONS_ERRORS.THIS_STATION_WORKER_HAVE_STATION],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public allStationsMatchOfClientsOrFail(
    foundStations: { stationId: number; clientId: number }[],
    stationsToCheck: { stationId: number; clientId: number; index: number }[],
  ): void {
    const stationsWithInvalidClients = stationsToCheck.filter(
      ({ stationId, clientId }) =>
        !foundStations.find(
          (item) => item.stationId === stationId && item.clientId === clientId,
        ),
    );

    if (stationsWithInvalidClients.length === 0) return;

    const preparedErrors = getPreparedChildrenErrors(
      stationsWithInvalidClients,
      {
        field: 'clientId',
        messages: [STATIONS_ERRORS.CLIENT_NOT_EXISTS_OR_DONT_HAVE_THIS_WORKER],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public allStationsWithoutWorkersExistingOrFail(
    foundStations: { stationId: number; stationWorkerId: number | null }[],
    stationsToCheck: { stationId: number; index: number }[],
  ): void {
    const workersWithStations = foundStations.filter(
      ({ stationWorkerId }) => !isNull(stationWorkerId),
    );

    if (workersWithStations.length === 0) return;

    const result = stationsToCheck.filter(({ stationId }) =>
      workersWithStations.find((item) => item.stationId === stationId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationId',
      messages: [STATIONS_ERRORS.THIS_STATION_HAVE_STATION_WORKER],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
