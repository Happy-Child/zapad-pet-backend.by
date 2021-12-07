import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { BidRejectReviewRepository, BidsRepository } from '../../repositories';
import { BidsGeneralService } from '../bids-general.service';
import { BID_REVIEW_TYPE, BID_STATUS } from '../../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS, USER_ROLES } from '@app/constants';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../../auth/dtos';
import moment from 'moment';

@Injectable()
export class BidsSetReviewStatusService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly connection: Connection,
  ) {}

  public async setAcceptedStatusOrFail(
    bidId: number,
    user: StationWorkerMemberJWTPayloadDTO | DistrictLeaderMemberJWTPayloadDTO,
  ): Promise<true> {
    await this.checkBeforeFinalReviewOrFail(bidId, user);
    await this.acceptedBidReview(bidId, user);
    return true;
  }

  public async setRejectedStatusOrFail(
    bidId: number,
    user: StationWorkerMemberJWTPayloadDTO | DistrictLeaderMemberJWTPayloadDTO,
    text: string,
  ): Promise<true> {
    await this.checkBeforeFinalReviewOrFail(bidId, user);
    await this.rejectedBidReview(bidId, user, text);
    return true;
  }

  private async checkBeforeFinalReviewOrFail(
    bidId: number,
    user: StationWorkerMemberJWTPayloadDTO | DistrictLeaderMemberJWTPayloadDTO,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(bidId, user);
    this.isValidStatusForFinalReview(bid.status, user.role);
  }

  private isValidStatusForFinalReview(
    bidStatus: BID_STATUS,
    userRole: USER_ROLES.STATION_WORKER | USER_ROLES.DISTRICT_LEADER,
  ): void {
    const bidStatusShouldBe =
      userRole === USER_ROLES.DISTRICT_LEADER
        ? BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER
        : BID_STATUS.PENDING_REVIEW_FROM_STATION_WORKER;

    if (bidStatusShouldBe !== bidStatus) {
      throw new ExceptionsForbidden([
        {
          field: '',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_SET_REVIEW],
        },
      ]);
    }
  }

  private async acceptedBidReview(
    bidId: number,
    user: StationWorkerMemberJWTPayloadDTO | DistrictLeaderMemberJWTPayloadDTO,
  ): Promise<void> {
    if (user.role === USER_ROLES.STATION_WORKER) {
      await this.bidsRepository.updateEntity(
        { id: bidId },
        {
          status: BID_STATUS.COMPLETED,
          confirmedStationWorkerId: user.userId,
          confirmSuccessAt: moment().toISOString(),
        },
      );

      return;
    }

    await this.bidsRepository.updateEntity(
      { id: bidId },
      {
        status: BID_STATUS.PENDING_REVIEW_FROM_STATION_WORKER,
      },
    );
  }

  private async rejectedBidReview(
    bidId: number,
    user: StationWorkerMemberJWTPayloadDTO | DistrictLeaderMemberJWTPayloadDTO,
    text: string,
  ): Promise<void> {
    const finalStatus =
      user.role === USER_ROLES.STATION_WORKER
        ? BID_STATUS.FAIL_REVIEW_FROM_STATION_WORKER
        : BID_STATUS.FAIL_REVIEW_FROM_DISTRICT_LEADER;

    const finalReviewType =
      user.role === USER_ROLES.STATION_WORKER
        ? BID_REVIEW_TYPE.STATION_WORKER
        : BID_REVIEW_TYPE.DISTRICT_LEADER;

    await this.connection.transaction(async (manager) => {
      const bidsRepository = manager.getCustomRepository(BidsRepository);
      const bidRejectReviewRepository = manager.getCustomRepository(
        BidRejectReviewRepository,
      );

      await bidsRepository.updateEntity({ id: bidId }, { status: finalStatus });

      await bidRejectReviewRepository.saveEntity({
        userId: user.userId,
        type: finalReviewType,
        bidId,
        text,
      });
    });
  }
}
