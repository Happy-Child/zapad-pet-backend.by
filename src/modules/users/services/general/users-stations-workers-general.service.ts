import { Injectable } from '@nestjs/common';
import { UsersStationsWorkersRepository } from '../../repositories';

@Injectable()
export class UsersStationsWorkersGeneralService {
  public static async updateStationsOfStationsWorkers(
    items: {
      stationWorkerId: number;
      stationId: number | null;
    }[],
    repository: UsersStationsWorkersRepository,
  ): Promise<void> {
    const recordsToUpdates = items.map(
      ({ stationWorkerId: userId, stationId }) => ({
        criteria: { userId },
        inputs: { stationId },
      }),
    );
    await repository.updateEntities(recordsToUpdates);
  }
}
