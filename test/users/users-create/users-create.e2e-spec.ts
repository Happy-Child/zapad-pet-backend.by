import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import { JwtService } from '@nestjs/jwt';
import {
  bootstrapTestApp,
  getTestAccessTokensByRoles,
} from '../../test.helpers';
import { COOKIE } from '../../../src/modules/auth/constants';
import { USER_ROLES } from '@app/constants';
import mockUsersData from '../../../static/mock-data/users';
import { TEST_USERS_TO_CREATE } from './users-create.test-constants';

const TOTAL_USERS_COUNT =
  mockUsersData.filter(({ role }) => role !== USER_ROLES.MASTER).length +
  TEST_USERS_TO_CREATE.length;

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('POST /users', () => {
    const API_URL = '/users';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles)
          .filter((role) => role !== USER_ROLES.MASTER)
          .map((role) =>
            request(server)
              .post(API_URL)
              .set(
                'Cookie',
                `${COOKIE.ACCESS_TOKEN}=${
                  accessTokensByRoles[role as USER_ROLES]
                };`,
              )
              .expect(({ status }) => {
                expect(status).toBe(HttpStatus.FORBIDDEN);
              }),
          );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be create users',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .post(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .send({
            users: TEST_USERS_TO_CREATE,
          })
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.OK);
          });
      },
      TEST_TIMEOUT,
    );

    it(
      'should be exists created users',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .get(`${API_URL}?take=5`)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual({
              totalItemsCount: TOTAL_USERS_COUNT,
              items: expect.any(Array),
              take: 5,
              skip: 0,
            });
          });
      },
      TEST_TIMEOUT,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
