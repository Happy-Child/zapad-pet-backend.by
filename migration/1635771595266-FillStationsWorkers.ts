import { MigrationInterface, QueryRunner } from 'typeorm';
import { StationWorkerEntity } from '@app/entities';
import stationWorkers from '../static/fake-db-data/stations-workers.fake';

export class FillStationsWorkers1635771595266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(StationWorkerEntity, stationWorkers);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
