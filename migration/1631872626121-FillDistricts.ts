import { MigrationInterface, QueryRunner } from 'typeorm';
import { INITIAL_DISTRICT_DATA_MAP } from '../static/initial-db-data/districts.initial';
import { DistrictEntity } from '@app/entities';

export class FillDistricts1631872626121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      DistrictEntity,
      Object.values(INITIAL_DISTRICT_DATA_MAP),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
