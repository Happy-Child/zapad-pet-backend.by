import { EntityRepository } from 'typeorm';
import { BidRejectReviewEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { BidLastReviewResponseDTO } from '../dtos';
import { SORT_DURATION, USER_ROLES } from '@app/constants';
import { BID_REVIEW_TYPE } from '../constants';

@EntityRepository(BidRejectReviewEntity)
export class BidRejectReviewRepository extends GeneralRepository<BidRejectReviewEntity> {
  protected entitySerializer = BidRejectReviewEntity;

  public async getBidLastReviewByRole(
    bidId: number,
    userRole:
      | USER_ROLES.DISTRICT_LEADER
      | USER_ROLES.MASTER
      | USER_ROLES.STATION_WORKER,
  ): Promise<BidLastReviewResponseDTO> {
    let districtLeaderReview = null;
    let stationWorkerReview = null;

    const getEntity = (type: BID_REVIEW_TYPE) =>
      this.getOne({
        where: { type },
        order: {
          createdAt: SORT_DURATION.DESC,
        },
        relations: ['user'],
      });

    if (userRole === USER_ROLES.MASTER) {
      districtLeaderReview = await getEntity(BID_REVIEW_TYPE.DISTRICT_LEADER);
      stationWorkerReview = await getEntity(BID_REVIEW_TYPE.STATION_WORKER);
    } else if (userRole === USER_ROLES.STATION_WORKER) {
      stationWorkerReview = await getEntity(BID_REVIEW_TYPE.STATION_WORKER);
    } else {
      districtLeaderReview = await getEntity(BID_REVIEW_TYPE.DISTRICT_LEADER);
    }

    return new BidLastReviewResponseDTO({
      districtLeaderReview,
      stationWorkerReview,
    });
  }
}
