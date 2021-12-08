import { Injectable } from '@nestjs/common';
import { BidRejectReviewRepository } from '../../repositories';
import { BidsGeneralService } from '../bids-general.service';
import { BidLastReviewResponseDTO } from '../../dtos';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  MasterJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../../auth/dtos';

@Injectable()
export class BidsGettingGeneralService {
  constructor(
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly bidRejectReviewRepository: BidRejectReviewRepository,
  ) {}

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
}
