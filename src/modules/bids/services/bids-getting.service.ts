import { Injectable } from '@nestjs/common';
import { BidRejectReviewRepository, BidsRepository } from '../repositories';
import { BidsGeneralService } from './bids-general.service';
import { TJwtPayloadDTO } from '../../auth/types';
import { BidLastReviewResponseDTO } from '../dtos';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  MasterJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../auth/dtos';

@Injectable()
export class BidsGettingService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly bidRejectReviewRepository: BidRejectReviewRepository,
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

  public async getLastReviewOrFail(
    bidId: number,
    user:
      | DistrictLeaderMemberJWTPayloadDTO
      | StationWorkerMemberJWTPayloadDTO
      | MasterJWTPayloadDTO,
  ): Promise<BidLastReviewResponseDTO> {
    await this.bidsGeneralService.getBidByRoleOrFail(bidId, user);
    return this.bidRejectReviewRepository.getBidLastReviewByRole(
      bidId,
      user.role,
    );
  }

  public async getListWithPagination(user: TJwtPayloadDTO): Promise<void> {
    // TODO strategy for every role?
  }
}
