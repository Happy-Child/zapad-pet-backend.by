import { MigrationInterface, QueryRunner } from 'typeorm';
import { StationEntity } from '@app/entities';
import stations from '../static/fake-db-data/stations.fake';

export class FillStations1635768258402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ast = await queryRunner.manager.query('SELECT * FROM client');

    console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBB', ast);

    await queryRunner.manager.save(StationEntity, stations);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
