import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateEngineerDTO } from '../../users/dtos/users-update.dtos';
import {
  groupedByChangedFields,
  groupedByValueOfObjectKeyWillBe,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { EngineerMemberDTO } from '../dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { EngineersGeneralService } from './engineers-general.service';

@Injectable()
export class EngineersCheckBeforeUpdateService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly engineersGeneralService: EngineersGeneralService,
  ) {}

  public async executeOrFail(
    engineers: NonEmptyArray<UsersUpdateEngineerDTO & { index: number }>,
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const groupedEngineersToCheck = groupedByChangedFields(
      engineers,
      foundEngineers,
      ['engineerDistrictId'],
    );

    await this.checkExistingDistrictsOrFail(
      groupedEngineersToCheck.engineerDistrictId,
      foundEngineers,
    );

    await this.canBeDeleteDistrictsOrFail(
      groupedEngineersToCheck.engineerDistrictId,
      foundEngineers,
    );
  }

  private async checkExistingDistrictsOrFail(
    groupByDistrictId: (UsersUpdateEngineerDTO & { index: number })[],
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const { added, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundEngineers,
      'engineerDistrictId',
    );

    const records = [...added, ...replaced];

    if (isNonEmptyArray(records)) {
      const preparedRecords = records.map(({ engineerDistrictId, index }) => ({
        districtId: engineerDistrictId,
        index,
      })) as NonEmptyArray<{ districtId: number; index: number }>;

      await this.entityFinderGeneralService.allDistrictsExistsOrFail(
        preparedRecords,
      );
    }
  }

  private async canBeDeleteDistrictsOrFail(
    groupByDistrictId: (UsersUpdateEngineerDTO & { index: number })[],
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const { deleted } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundEngineers,
      'engineerDistrictId',
    );

    if (isNonEmptyArray(deleted)) {
      await this.engineersGeneralService.allEngineersCanBeChangeDistrictsOrFail(
        deleted,
      );
    }
  }
}
