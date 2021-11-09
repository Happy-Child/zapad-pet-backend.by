import { Injectable } from '@nestjs/common';
import { NonEmptyArray, NonNullableObject } from '@app/types';
import { isNonEmptyArray } from '@app/helpers';
import { ClientsGeneralService } from '../../../clients/services';
import { StationsGeneralService } from '../../../stations/services';
import { UsersCreateFullStationWorkerDTO } from '../../dtos';
import { groupedByNull } from '@app/helpers/grouped.helpers';
import { StationsWorkersGeneralService } from '../../../stations-workers/services';

@Injectable()
export class StationsWorkersCheckBeforeCreateService {
  constructor(
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly stationsWorkersGeneralService: StationsWorkersGeneralService,
  ) {}

  public async executeOrFail(
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
      await this.clientsGeneralService.allClientsExistsOrFail(
        workersWithoutStations,
      );
    }
  }

  private async allStationsWithoutWorkersExistingOrFail(
    workersWithStations: NonEmptyArray<{
      stationId: number;
      clientId: number;
      index: number;
    }>,
  ): Promise<void> {
    const preparedStations = workersWithStations.map(
      ({ stationId: id, index }) => ({
        id,
        index,
      }),
    ) as NonEmptyArray<{ id: number; index: number }>;
    const foundStations =
      await this.stationsGeneralService.allStationsExistsOrFail(
        preparedStations,
        'stationId',
      );

    const preparedFoundStations = foundStations.map(
      ({ id, clientId, stationWorkerId }) => ({
        stationId: id,
        clientId,
        stationWorkerId,
      }),
    );

    this.stationsWorkersGeneralService.allStationsMatchOfClientsOrFail(
      preparedFoundStations,
      workersWithStations,
    );

    this.stationsWorkersGeneralService.allStationsWithoutWorkersExistingOrFail(
      preparedFoundStations,
      workersWithStations,
    );
  }
}
