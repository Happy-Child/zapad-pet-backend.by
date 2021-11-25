import { Injectable } from '@nestjs/common';
import { NonEmptyArray, NonNullableObject } from '@app/types';
import { isNonEmptyArray } from '@app/helpers';
import { UsersCreateFullStationWorkerDTO } from '../../users/dtos';
import { groupedByNull } from '@app/helpers/grouped.helpers';
import { StationsWorkersGeneralService } from './index';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class StationsWorkersCheckBeforeCreateService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
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
      await this.allStationsMatchAndWithoutWorkersOrFail(workersWithStations);
    }

    if (isNonEmptyArray(workersWithoutStations)) {
      // Check existing only clients
      await this.entityFinderGeneralService.allClientsExistsOrFail(
        workersWithoutStations,
      );
    }
  }

  private async allStationsMatchAndWithoutWorkersOrFail(
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
      await this.entityFinderGeneralService.allStationsExistsOrFail(
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

    this.stationsWorkersGeneralService.allStationsWithoutWorkersOrFail(
      preparedFoundStations,
      workersWithStations,
    );
  }
}
