import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '@app/entities';
import users from '../static/fake-db-data/users.fake';

export class FillUsers1635765699225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(UserEntity, users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
