import { MigrationInterface, QueryRunner } from 'typeorm';
import { StationEntity } from '@app/entities';
import stations from '../static/mock-data/stations';

export class FillStations1635768258402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(StationEntity, stations);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
