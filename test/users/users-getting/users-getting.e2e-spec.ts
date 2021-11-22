import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import qs from 'querystring';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import { JwtService } from '@nestjs/jwt';
import {
  bootstrapTestApp,
  getTestAccessTokensByRoles,
} from '../../test.helpers';
import { COOKIE } from '../../../src/modules/auth/constants';
import { ENTITIES_FIELDS, USER_ROLES } from '@app/constants';
import { MOCK_STATIONS_WORKERS_MAP } from '../../../static/mock-data/users/stations-workers.mock';
import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../../static/mock-data/users/engineers.mock';
import { TEST_USERS_GETTING_ENGINEERS_VALID_RESPONSE } from './users-getting.test-constants';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('GET /users', () => {
    const API_URL = '/users';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles)
          .filter((role) => role !== USER_ROLES.MASTER)
          .map((role) =>
            request(server)
              .get(API_URL)
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
      'should be valid response',
      () => {
        const server = app.getHttpServer();

        const requests = [
          request(server)
            .get(
              `${API_URL}?${qs.stringify({
                take: 5,
                role: [USER_ROLES.STATION_WORKER],
                sortBy: ENTITIES_FIELDS.ID,
                clientId: 4,
              })}`,
            )
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual({
                totalItemsCount: 1,
                items: [
                  {
                    ...getObjWithoutFields<any, any>(
                      MOCK_STATIONS_WORKERS_MAP.WORKER_7,
                      ['password'],
                    ),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                ],
                take: 5,
                skip: 0,
              });
            }),
          request(server)
            .get(
              `${API_URL}?${qs.stringify({
                take: 40,
                sortBy: ENTITIES_FIELDS.NAME,
                search: 'engine',
              })}`,
            )
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual({
                totalItemsCount: Object.values(MOCK_ENGINEERS_MAP).length,
                items: TEST_USERS_GETTING_ENGINEERS_VALID_RESPONSE,
                take: 40,
                skip: 0,
              });
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /users/:id', () => {
    const API_URL = '/users';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles)
          .filter((role) => role !== USER_ROLES.MASTER)
          .map((role) =>
            request(server)
              .get(`${API_URL}/5`)
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
      'should be valid response',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .get(`${API_URL}/5`)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual({
              ...getObjWithoutFields<any, any>(
                MOCK_STATIONS_WORKERS_MAP.WORKER_5,
                ['password'],
              ),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
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
