import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { BidsGeneralService } from './bids-general.service';
import { TJwtPayloadDTO } from '../../auth/types';

@Injectable()
export class BidsGettingService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  public async getByIdOrFail(
    bidId: number,
    user: TJwtPayloadDTO,
  ): Promise<any> {
    await this.bidsGeneralService.getBidByRoleOrFail(bidId, user);

    const result = await this.bidsRepository.getOne({ id: bidId });

    // TODO continue impl

    return result;
  }

  public async getListWithPagination(user: TJwtPayloadDTO): Promise<void> {
    // TODO strategy for every role?
  }
}
