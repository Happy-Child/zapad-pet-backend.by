import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { StationWorkerEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../../stations/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { isNull } from '@app/helpers';
import { StationsWorkersRepository } from '../repositories';

interface IStationWorkerToCheck {
  stationWorkerId: number;
  clientId: number;
  index: number;
}

@Injectable()
export class StationsWorkersGeneralService {
  constructor(
    private readonly stationsWorkersRepository: StationsWorkersRepository,
  ) {}

  public async allWorkersExistingAndMatchOfClientsOrFail(
    workersToCheck: NonEmptyArray<IStationWorkerToCheck>,
  ): Promise<StationWorkerEntity[]> {
    const usersIds = workersToCheck.map(
      ({ stationWorkerId }) => stationWorkerId,
    ) as NonEmptyArray<number>;

    const foundWorkers = await this.stationsWorkersRepository.getManyByColumn(
      usersIds,
      'userId',
    );

    this.allWorkersMatchOfClientsOrFail(foundWorkers, workersToCheck);

    return foundWorkers;
  }

  public async allWorkersWithoutStationsExistingOrFail(
    workersToCheck: NonEmptyArray<IStationWorkerToCheck>,
  ): Promise<void> {
    const foundWorkers = await this.allWorkersExistingAndMatchOfClientsOrFail(
      workersToCheck,
    );
    this.allWorkersWithoutStationsOrFail(foundWorkers, workersToCheck);
  }

  private allWorkersMatchOfClientsOrFail(
    foundWorkers: StationWorkerEntity[],
    workersToCheck: IStationWorkerToCheck[],
  ): void {
    const workersWithInvalidClients = workersToCheck.filter(
      ({ stationWorkerId: userId, clientId }) =>
        !foundWorkers.find(
          (item) => item.userId === userId && item.clientId === clientId,
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
    foundWorkers: StationWorkerEntity[],
    workersToCheck: IStationWorkerToCheck[],
  ): void {
    const workersWithStations = foundWorkers.filter(
      ({ stationId }) => !isNull(stationId),
    );

    if (workersWithStations.length === 0) return;

    const result = workersToCheck.filter(({ stationWorkerId: userId }) =>
      workersWithStations.find((item) => item.userId === userId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationWorkerId',
      messages: [STATIONS_ERRORS.THIS_STATION_WORKER_HAVE_STATION],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
