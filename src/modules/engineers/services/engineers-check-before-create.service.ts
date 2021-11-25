import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersCreateFullEngineerDTO } from '../../users/dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class EngineersCheckBeforeCreateService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async executeOrFail(
    engineers: NonEmptyArray<UsersCreateFullEngineerDTO>,
  ): Promise<void> {
    const preparedDistrictsRecords = engineers.map(
      ({ index, engineerDistrictId }) => ({
        index,
        districtId: engineerDistrictId,
      }),
    ) as NonEmptyArray<{ districtId: number; index: number }>;
    await this.entityFinderGeneralService.allDistrictsExistsOrFail(
      preparedDistrictsRecords,
      'engineerDistrictId',
    );
  }
}
