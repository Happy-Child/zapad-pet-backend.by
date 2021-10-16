import { Injectable } from '@nestjs/common';
import { StationsCreateItemDTO } from '../../dtos';
import { StationsRepository } from '../../repositories/stations.repository';
import { UsersStationsWorkersRepository } from '../../../users/repositories';
import { isNull } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { STATIONS_ERRORS } from '../../constants/stations-errors.constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ClientsRepository } from '../../../clients/repositories';
import { DistrictsRepository } from '../../../districts/repositories';
import { StationWorkerEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';

@Injectable()
export class StationsCheckBeforeCreateService {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly districtsRepository: DistrictsRepository,
    private readonly usersStationsWorkersRepository: UsersStationsWorkersRepository,
  ) {}

  public async generalCheckSOfStations(
    stations: NonEmptyArray<StationsCreateItemDTO & { index: number }>,
  ): Promise<void> {
    await this.stationsRepository.stationsNumbersEmptyOrFail(stations);
    await this.clientsRepository.clientsExistsOrFail(stations);
    await this.districtsRepository.districtsExistsOrFail(stations);
  }

  public async checkStationsWorkersOrFail(
    stationsData: NonEmptyArray<{
      stationWorkerId: number;
      clientId: number;
      index: number;
    }>,
  ): Promise<void> {
    const foundWorkers =
      await this.usersStationsWorkersRepository.getExistedStationsWorkersOrFail(
        stationsData,
      );
    await this.clientsHaveWorkersOrFail(foundWorkers, stationsData);
    await this.stationsWorkersWithoutStationsOrFail(foundWorkers, stationsData);
  }

  private clientsHaveWorkersOrFail(
    foundWorkers: StationWorkerEntity[],
    stationsData: {
      stationWorkerId: number;
      clientId: number;
      index: number;
    }[],
  ): void {
    const workersWithInvalidClients = stationsData.filter(
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
        messages: [STATIONS_ERRORS.CLIENT_DONT_HAVE_THIS_WORKER],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  private stationsWorkersWithoutStationsOrFail(
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
