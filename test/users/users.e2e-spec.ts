import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import qs from 'querystring';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import { JwtService } from '@nestjs/jwt';
import { bootstrapTestApp, getTestAccessTokensByRoles } from '../test.helpers';
import { COOKIE } from '../../src/modules/auth/constants';
import { ENTITIES_FIELDS, USER_ROLES } from '@app/constants';
import mockUsersData from '../../static/mock-data/users';
import {
  GET_USERS_VALID_RESPONSE_ITEMS,
  TEST_USERS_TO_CREATE,
} from './test-users.constants';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';
import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../static/mock-data/users/engineers.mock';

const totalUsersCount = mockUsersData.filter(
  ({ role }) => role !== USER_ROLES.MASTER,
).length;

const totalEngineersCount =
  Object.values(MOCK_ENGINEERS_MAP).length +
  TEST_USERS_TO_CREATE.filter(({ role }) => role === USER_ROLES.ENGINEER)
    .length;

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
              .send({
                users: [
                  {
                    name: 'test user name',
                    email: 'test@mail.ru',
                    role: USER_ROLES.ACCOUNTANT,
                    password: 'test_pass_123',
                  },
                ],
              })
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
              totalItemsCount: totalUsersCount + TEST_USERS_TO_CREATE.length,
              items: expect.any(Array),
              take: 5,
              skip: 0,
            });
          });
      },
      TEST_TIMEOUT,
    );
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
                totalItemsCount: 3,
                items: [
                  {
                    ...getObjWithoutFields<any, any>(TEST_USERS_TO_CREATE[1], [
                      'password',
                    ]),
                    emailConfirmed: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                  {
                    ...getObjWithoutFields<any, any>(TEST_USERS_TO_CREATE[0], [
                      'password',
                    ]),
                    emailConfirmed: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
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
                totalItemsCount: totalEngineersCount,
                items: GET_USERS_VALID_RESPONSE_ITEMS,
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
