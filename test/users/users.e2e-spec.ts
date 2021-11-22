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
  UPDATE_ENGINEERS,
  UPDATE_STATIONS_WORKERS,
} from './test-users.constants';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';
import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../static/mock-data/users/engineers.mock';
import { MOCK_DISTRICTS_LEADERS_MAP } from '../../static/mock-data/users/districts-leaders.mock';

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

  describe('PUT /users', () => {
    const API_URL = '/users';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles)
          .filter((role) => role !== USER_ROLES.MASTER)
          .map((role) =>
            request(server)
              .put(API_URL)
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
      'should be update users',
      () => {
        const server = app.getHttpServer();

        const requests = [
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: UPDATE_STATIONS_WORKERS,
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.CREATED);
              expect(body).toStrictEqual(
                UPDATE_STATIONS_WORKERS.map((item) => ({
                  ...item,
                  role: expect.any(String),
                  emailConfirmed: expect.any(Boolean),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                })),
              );
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: UPDATE_ENGINEERS,
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.CREATED);
              expect(body).toStrictEqual(
                UPDATE_ENGINEERS.map((item) => ({
                  ...item,
                  role: expect.any(String),
                  emailConfirmed: expect.any(Boolean),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                })),
              );
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be bad request',
      () => {
        const server = app.getHttpServer();

        const shouldBeBadRequestById = UPDATE_STATIONS_WORKERS.map((item) => ({
          ...item,
          id: 1,
        }));

        const shouldBeBadRequestByEmails = UPDATE_STATIONS_WORKERS.map(
          (item) => ({
            ...item,
            email: 'not_unieue@mail.ru',
          }),
        );

        const shouldBeBadRequestByRoles = UPDATE_STATIONS_WORKERS.map(
          (item) => ({
            ...item,
            role: USER_ROLES.ENGINEER,
          }),
        );

        const shouldBeBadRequestByLeaderDistrictId = Object.values(
          MOCK_DISTRICTS_LEADERS_MAP,
        ).map((item) => ({
          ...getObjWithoutFields<any, any>(item, ['password']),
          leaderDistrictId: 1,
        }));

        const shouldBeBadRequestByClientId = [
          ...UPDATE_STATIONS_WORKERS.map((item, index) => ({
            ...item,
            clientId: null,
            stationId: index + 1,
          })),
        ];

        const requests = [
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestById,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByEmails,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByRoles,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByLeaderDistrictId,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByClientId,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be unprocessable entity',
      () => {
        const server = app.getHttpServer();

        const shouldBeUnprocessableEntityByEmails = UPDATE_STATIONS_WORKERS.map(
          (item, index) => ({
            ...item,
            email: `district_leader_${index + 1}@mail.ru`,
          }),
        );

        const mockDistrictLeaders = Object.values(MOCK_DISTRICTS_LEADERS_MAP);

        const shouldBeUnprocessableEntityByLeaderDistrictId =
          mockDistrictLeaders.map((item, index) => ({
            ...getObjWithoutFields<any, any>(item, ['password']),
            leaderDistrictId:
              mockDistrictLeaders.reverse()[index].leaderDistrictId,
          }));

        const requests = [
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeUnprocessableEntityByEmails,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeUnprocessableEntityByLeaderDistrictId,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be not found',
      () => {
        const server = app.getHttpServer();

        const shouldBeBadRequestByDistrictId = [
          ...Object.values(MOCK_DISTRICTS_LEADERS_MAP).map((item, index) => ({
            ...getObjWithoutFields<any, any>(item, ['password']),
            leaderDistrictId: 2000 + index,
          })),
          ...Object.values(MOCK_ENGINEERS_MAP).map((item, index) => ({
            ...getObjWithoutFields<any, any>(item, ['password']),
            engineerDistrictId: 4000 + index,
          })),
        ];

        const shouldBeBadRequestByClientIdOrStationId = [
          ...UPDATE_STATIONS_WORKERS.map((item, index) => ({
            ...item,
            clientId: 100,
            stationId: 1000 + index,
          })),
        ];

        const requests = [
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByDistrictId,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.NOT_FOUND);
            }),
          request(server)
            .put(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              users: shouldBeBadRequestByClientIdOrStationId,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.NOT_FOUND);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
