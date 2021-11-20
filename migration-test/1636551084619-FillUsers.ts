import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import users from '../static/mock-data/users';
import { MOCK_USER_PASSWORD_HASH } from '../static/mock-data/users/mock.constants';
import { USER_ROLES } from '@app/constants';

export class FillUsers1636551084619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const requestsToCreatesStationsWorkers: Promise<any>[] = [];
    const requestsToCreatedDistrictsLeaders: Promise<any>[] = [];
    const requestsToCreateEngineers: Promise<any>[] = [];

    const requestsToCreateUsers = users.map(async (rawUser) => {
      const { role, id } = await queryRunner.manager.save(UserEntity, {
        ...rawUser,
        password: MOCK_USER_PASSWORD_HASH,
      });

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
