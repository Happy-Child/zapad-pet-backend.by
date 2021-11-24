import { Injectable } from '@nestjs/common';
import { RegionEntity } from '@app/entities';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/constants';
import { RegionsRepository } from '../repositories';
import { REGIONS_ERRORS } from '../constants';

@Injectable()
export class RegionsGeneralService {
  constructor(private readonly regionsRepository: RegionsRepository) {}

  public async getRegionOrFail(id: number): Promise<RegionEntity> {
    return await this.regionsRepository.getOneOrFail(
      { id },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: ENTITIES_FIELDS.ID,
              messages: [REGIONS_ERRORS.REGION_NOT_EXIST],
            },
          ],
        },
      },
    );
  }
}
