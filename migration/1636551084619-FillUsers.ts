import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import users from '../static/fake-db-data/users.fake';
import { USER_ROLES } from '../src/modules/users/constants';

export class FillUsers1636551084619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const requestsToCreatesStationsWorkers: Promise<any>[] = [];
    const requestsToCreatedDistrictsLeaders: Promise<any>[] = [];
    const requestsToCreateEngineers: Promise<any>[] = [];

    const requestsToCreateUsers = users.map(async (rawUser) => {
      const { role, id } = await queryRunner.manager.save(UserEntity, rawUser);
      switch (role) {
        case USER_ROLES.STATION_WORKER:
          requestsToCreatesStationsWorkers.push(
            queryRunner.manager.save(StationWorkerEntity, {
              ...rawUser,
              userId: id,
            }),
          );
          return;
        case USER_ROLES.DISTRICT_LEADER:
          requestsToCreatedDistrictsLeaders.push(
            queryRunner.manager.save(DistrictLeaderEntity, {
              ...rawUser,
              userId: id,
            }),
          );
          return;
        case USER_ROLES.ENGINEER:
          requestsToCreateEngineers.push(
            queryRunner.manager.save(EngineerEntity, {
              ...rawUser,
              userId: id,
            }),
          );
          return;
      }
    });

    await Promise.all(requestsToCreateUsers);
    await Promise.all([
      ...requestsToCreatesStationsWorkers,
      ...requestsToCreatedDistrictsLeaders,
      ...requestsToCreateEngineers,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
