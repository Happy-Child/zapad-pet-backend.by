import { EntityRepository } from 'typeorm';
import { BidEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(BidEntity)
export class BidsRepository extends GeneralRepository<BidEntity> {
  protected entitySerializer = BidEntity;
}
