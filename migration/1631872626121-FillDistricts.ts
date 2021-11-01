import { MigrationInterface, QueryRunner } from 'typeorm';
import districts from '../static/fake-db-data/districts.fake';
import { DistrictEntity } from '@app/entities';

export class FillDistricts1631872626121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(DistrictEntity, districts);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
