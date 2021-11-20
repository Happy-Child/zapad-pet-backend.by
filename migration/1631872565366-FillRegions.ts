import { MigrationInterface, QueryRunner } from 'typeorm';
import { INITIAL_REGIONS_DATA_MAP } from '../static/initial-db-data/regions.initial';
import { RegionEntity } from '@app/entities';

export class FillRegions1631872565366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      RegionEntity,
      Object.values(INITIAL_REGIONS_DATA_MAP),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
