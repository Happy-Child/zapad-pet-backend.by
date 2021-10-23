import { Injectable } from '@nestjs/common';
import { isNull } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../../constants/stations-errors.constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationWorkerEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';

@Injectable()
export class StationsCheckWorkersService {
  public workersCanBeAddToStationsOrFail(
    workers: StationWorkerEntity[],
    stationsData: NonEmptyArray<{
      stationWorkerId: number;
      clientId: number;
      index: number;
    }>,
  ): void {
    this.workersMatchOfClientsOrFail(workers, stationsData);
    this.workersWithoutStationsOrFail(workers, stationsData);
  }

  public workersMatchOfClientsOrFail(
    existingWorkers: StationWorkerEntity[],
    stationsData: {
      stationWorkerId: number;
      clientId: number;
      index: number;
    }[],
  ): void {
    const workersWithInvalidClients = stationsData.filter(
      ({ stationWorkerId: userId, clientId }) =>
        !existingWorkers.find(
          (item) => item.userId === userId && item.clientId === clientId,
        ),
    );

    if (workersWithInvalidClients.length === 0) return;

    const preparedErrors = getPreparedChildrenErrors(
      workersWithInvalidClients,
      {
        field: 'clientId',
        messages: [STATIONS_ERRORS.CLIENT_DONT_HAVE_THIS_WORKER],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public workersWithoutStationsOrFail(
    workersShouldBeWithoutStations: StationWorkerEntity[],
    stationsData: {
      stationWorkerId: number;
      clientId: number;
      index: number;
    }[],
  ): void {
    const workersWithStations = workersShouldBeWithoutStations.filter(
      ({ stationId }) => !isNull(stationId),
    );

    if (workersWithStations.length === 0) return;

    const result = stationsData.filter(({ stationWorkerId: userId }) =>
      workersWithStations.find((item) => item.userId === userId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationWorkerId',
      messages: [STATIONS_ERRORS.THIS_STATION_WORKER_HAVE_STATION],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
