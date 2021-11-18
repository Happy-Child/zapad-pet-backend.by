import { MigrationInterface, QueryRunner } from 'typeorm';
import regions from '../static/fill-db/regions.fake';
import { RegionEntity } from '@app/entities';

export class FillRegions1631872565366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(RegionEntity, regions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
