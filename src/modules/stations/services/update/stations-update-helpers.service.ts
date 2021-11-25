import { NonEmptyArray } from '@app/types';
import { StationWorkerEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../../constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { isNull } from '@app/helpers';
import { Injectable } from '@nestjs/common';
import { EntityFinderGeneralService } from '../../../entity-finder/services';

@Injectable()
export class StationsUpdateHelpersService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async allWorkersExistingAndMatchOfClientsOrFail(
    recordsToCheck: NonEmptyArray<{
      stationWorkerId: number;
      clientId: number;
      index: number;
    }>,
  ): Promise<StationWorkerEntity[]> {
    const workers =
      await this.entityFinderGeneralService.allWorkersExistingOrFail(
        recordsToCheck,
      );
    this.allWorkersMatchOfClientsOrFail(workers, recordsToCheck);
    return workers;
  }

  public allWorkersMatchOfClientsOrFail(
    foundWorkers: Pick<StationWorkerEntity, 'userId' | 'clientId'>[],
    workersToCheck: {
      stationWorkerId: number;
      clientId: number | null;
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

  public allWorkersWithoutStationsOrFail(
    foundWorkers: Pick<StationWorkerEntity, 'userId' | 'stationId'>[],
    workersToCheck: { stationWorkerId: number; index: number }[],
  ): void {
    const stationsWithWorkers = foundWorkers.filter(
      ({ stationId }) => !isNull(stationId),
    );

    if (stationsWithWorkers.length === 0) return;

    const result = workersToCheck.filter(({ stationWorkerId }) =>
      stationsWithWorkers.find((item) => item.userId === stationWorkerId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationWorkerId',
      messages: [STATIONS_ERRORS.THIS_STATION_WORKER_HAVE_STATION],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
