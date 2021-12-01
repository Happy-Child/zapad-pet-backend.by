import { MigrationInterface, QueryRunner } from 'typeorm';
import { BidEntity, BidTodoEntity } from '@app/entities';
import bids from '../static/mock-data/bids';

export class FillBids1637568148396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(BidEntity, bids);
    const requests = bids
      .map((bid) =>
        bid.todos.map(async ({ text }) =>
          queryRunner.manager.save(BidTodoEntity, { bidId: bid.id, text }),
        ),
      )
      .flat(1);
    await Promise.all(requests);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
