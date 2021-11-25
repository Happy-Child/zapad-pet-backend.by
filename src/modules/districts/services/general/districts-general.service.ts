import { Injectable } from '@nestjs/common';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { DistrictsRepository } from '../../repositories';
import { ENTITIES_FIELDS } from '@app/constants';
import { DISTRICTS_ERRORS } from '../../constants';
import { DistrictEntity } from '@app/entities';

@Injectable()
export class DistrictsGeneralService {
  constructor(private readonly districtsRepository: DistrictsRepository) {}

  public async getDistrictOrFail(id: number): Promise<DistrictEntity> {
    return await this.districtsRepository.getOneOrFail(
      {
        id,
      },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: ENTITIES_FIELDS.ID,
              messages: [DISTRICTS_ERRORS.DISTRICT_NOT_EXIST],
            },
          ],
        },
      },
    );
  }
}
