import { EntityRepository } from 'typeorm';
import { BidRejectReviewEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(BidRejectReviewEntity)
export class BidRejectReviewRepository extends GeneralRepository<BidRejectReviewEntity> {
  protected entitySerializer = BidRejectReviewEntity;
}
