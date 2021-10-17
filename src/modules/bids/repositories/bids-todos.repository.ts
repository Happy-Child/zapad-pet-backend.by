import { EntityRepository } from 'typeorm';
import { BidTodoEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(BidTodoEntity)
export class BidsTodosRepository extends GeneralRepository<BidTodoEntity> {
  protected entitySerializer = BidTodoEntity;
}
