import { Injectable } from '@nestjs/common';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '@app/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { isNull } from '@app/helpers';

@Injectable()
export class StationsWorkersGeneralService {
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

  public allStationsWithoutWorkersOrFail(
    foundStations: { stationId: number; stationWorkerId: number | null }[],
    stationsToCheck: { stationId: number; index: number }[],
  ): void {
    const stationsWithWorkers = foundStations.filter(
      ({ stationWorkerId }) => !isNull(stationWorkerId),
    );

    if (stationsWithWorkers.length === 0) return;

    const result = stationsToCheck.filter(({ stationId }) =>
      stationsWithWorkers.find((item) => item.stationId === stationId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationId',
      messages: [STATIONS_ERRORS.THIS_STATION_HAVE_STATION_WORKER],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
