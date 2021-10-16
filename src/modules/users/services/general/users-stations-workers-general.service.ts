import { Injectable } from '@nestjs/common';
import { StationWorkerEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';
import { UsersStationsWorkersRepository } from '../../repositories';

@Injectable()
export class UsersStationsWorkersGeneralService {
  public static async updateStationsOfStationsWorkers(
    items: {
      stationWorkerId: number;
      stationId: number | null;
    }[],
    repository: UsersStationsWorkersRepository,
  ): Promise<StationWorkerEntity[]> {
    const recordsToUpdates = items.map(
      ({ stationWorkerId: userId, stationId }) => ({
        criteria: { userId },
        inputs: { stationId },
      }),
    );

    await repository.updateEntities(recordsToUpdates);
    const stationWorkersIds = items.map(
      ({ stationWorkerId }) => stationWorkerId,
    ) as NonEmptyArray<number>;

    return repository.getManyByColumn(stationWorkersIds, 'userId');
  }
}
