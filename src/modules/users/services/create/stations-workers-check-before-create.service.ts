import { Injectable } from '@nestjs/common';
import { NonEmptyArray, NonNullableObject } from '@app/types';
import { isNonEmptyArray, isNull } from '@app/helpers';
import { ClientsGeneralCheckingService } from '../../../clients/services';
import { StationsGeneralCheckingService } from '../../../stations/services';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationExtendedDTO } from '../../../stations/dtos';
import { USERS_ERRORS } from '../../constants';
import { UsersCreateFullStationWorkerDTO } from '../../dtos';
import { groupedByNull } from '@app/helpers/grouped.helpers';

interface ICreateStationWorkerToCheck {
  stationId: number;
  clientId: number;
  index: number;
}

@Injectable()
export class StationsWorkersCheckBeforeCreateService {
  constructor(
    private readonly clientsGeneralCheckingService: ClientsGeneralCheckingService,
    private readonly stationsGeneralCheckingService: StationsGeneralCheckingService,
  ) {}

  public async executeOfFail(
    workers: NonEmptyArray<UsersCreateFullStationWorkerDTO>,
  ): Promise<void> {
    const [workersWithStations, workersWithoutStations] = groupedByNull(
      workers,
      'stationId',
    ) as [
      NonNullableObject<UsersCreateFullStationWorkerDTO>[],
      UsersCreateFullStationWorkerDTO[],
    ];

    if (isNonEmptyArray(workersWithStations)) {
      // Check existing clients and stations
      await this.allStationsWithoutWorkersExistingOrFail(workersWithStations);
    }

    if (isNonEmptyArray(workersWithoutStations)) {
      // Check existing only clients
      await this.clientsGeneralCheckingService.allClientsExistsOrFail(
        workersWithoutStations,
      );
    }
  }

  private async allStationsWithoutWorkersExistingOrFail(
    stationsToCheck: NonEmptyArray<{
      stationId: number;
      clientId: number;
      index: number;
    }>,
  ): Promise<void> {
    const preparedStations = stationsToCheck.map(
      ({ stationId: id, index }) => ({
        id,
        index,
      }),
    ) as NonEmptyArray<{ id: number; index: number }>;
    const foundStations =
      await this.stationsGeneralCheckingService.allStationsExistsOrFail(
        preparedStations,
        'stationId',
      );

    this.allStationsMatchOfClientsOrFail(foundStations, stationsToCheck);
    this.allStationsWithoutWorkersOrFail(foundStations, stationsToCheck);
  }

  private allStationsMatchOfClientsOrFail(
    foundStations: StationExtendedDTO[],
    stationsToCheck: ICreateStationWorkerToCheck[],
  ): void {
    const stationsWithInvalidClients = stationsToCheck.filter(
      ({ stationId, clientId }) =>
        !foundStations.find(
          (item) => item.id === stationId && item.clientId === clientId,
        ),
    );

    if (stationsWithInvalidClients.length === 0) return;

    const preparedErrors = getPreparedChildrenErrors(
      stationsWithInvalidClients,
      {
        field: 'clientId',
        messages: [USERS_ERRORS.CLIENT_NOT_EXISTS_OR_DONT_HAVE_THIS_STATION],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  private allStationsWithoutWorkersOrFail(
    foundWorkers: StationExtendedDTO[],
    workersToCheck: ICreateStationWorkerToCheck[],
  ): void {
    const stationsWithWorkers = foundWorkers.filter(
      ({ stationWorkerId }) => !isNull(stationWorkerId),
    );

    if (stationsWithWorkers.length === 0) return;

    const workersToException = workersToCheck.filter(({ stationId }) =>
      stationsWithWorkers.find((item) => item.id === stationId),
    );

    const preparedErrors = getPreparedChildrenErrors(workersToException, {
      field: 'stationId',
      messages: [USERS_ERRORS.STATION_ALREADY_EXISTS_AN_WORKER],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
