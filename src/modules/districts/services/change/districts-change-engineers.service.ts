import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DistrictsGeneralService } from '../general';
import { NonEmptyArray } from '@app/types';
import { EngineersGeneralService } from '../../../engineers/services';
import { EngineersRepository } from '../../../engineers/repositories';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import { EngineerEntity } from '@app/entities';

const gerIndexedEngineers = (
  ids: NonEmptyArray<number>,
): NonEmptyArray<{
  id: number;
  index: number;
}> =>
  ids.map((id, index) => ({
    id,
    index,
  })) as NonEmptyArray<{
    id: number;
    index: number;
  }>;

@Injectable()
export class DistrictsChangeEngineersService {
  constructor(
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly engineersGeneralService: EngineersGeneralService,
    private readonly connection: Connection,
  ) {}

  public async addEngineers(
    districtId: number,
    engineersIds: NonEmptyArray<number>,
  ): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);

    const indexedIds = gerIndexedEngineers(engineersIds);
    await this.engineersGeneralService.allEngineersExistingAndWithoutDistrictsOrFail(
      indexedIds,
    );

    await this.updateEngineers(districtId, engineersIds);
  }

  public async removeEngineers(
    districtId: number,
    engineersIds: NonEmptyArray<number>,
  ): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);

    const indexedIds = gerIndexedEngineers(engineersIds);
    await this.engineersGeneralService.allEngineersExistingOrFail(indexedIds);
    await this.engineersGeneralService.allEngineersHaveDistrictOrFail(
      indexedIds,
      districtId,
    );
    await this.engineersGeneralService.allEngineersCanBeChangeDistrictsOrFail(
      indexedIds,
    );

    await this.updateEngineers(null, engineersIds);
  }

  private async updateEngineers(
    engineerDistrictId: number | null,
    engineersIds: number[],
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<EngineerEntity>[] =
      engineersIds.map((userId) => ({
        criteria: { userId },
        inputs: { engineerDistrictId },
      }));

    await this.connection.transaction(async (manager) => {
      const engineersRepository =
        manager.getCustomRepository(EngineersRepository);
      await engineersRepository.updateEntities(recordsToUpdate);
    });
  }
}
