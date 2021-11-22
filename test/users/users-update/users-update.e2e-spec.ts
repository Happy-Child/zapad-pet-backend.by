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
import {
  TEST_USERS_UPDATE_ENGINEERS,
  TEST_USERS_UPDATE_STATIONS_WORKERS,
} from './users-update.test-constants';
import { MOCK_STATIONS_WORKERS_MAP } from '../../../static/mock-data/users/stations-workers.mock';
import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../../static/mock-data/users/engineers.mock';
import { MOCK_DISTRICTS_LEADERS_MAP } from '../../../static/mock-data/users/districts-leaders.mock';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
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
      'should be bad request',
      () => {
        const server = app.getHttpServer();

        const shouldBeBadRequestById = TEST_USERS_UPDATE_STATIONS_WORKERS.map(
          (item) => ({
            ...item,
            id: 1,
          }),
        );

        const shouldBeBadRequestByEmails =
          TEST_USERS_UPDATE_STATIONS_WORKERS.map((item) => ({
            ...item,
            email: 'not_unieue@mail.ru',
          }));

        const shouldBeBadRequestByRoles =
          TEST_USERS_UPDATE_STATIONS_WORKERS.map((item) => ({
            ...item,
            role: USER_ROLES.ENGINEER,
          }));

        const shouldBeBadRequestByLeaderDistrictId = Object.values(
          MOCK_DISTRICTS_LEADERS_MAP,
        ).map((item) => ({
          ...getObjWithoutFields<any, any>(item, ['password']),
          leaderDistrictId: 1,
        }));

        const shouldBeBadRequestByClientId = [
          ...TEST_USERS_UPDATE_STATIONS_WORKERS.map((item, index) => ({
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

        const shouldBeUnprocessableEntityByEmails =
          TEST_USERS_UPDATE_STATIONS_WORKERS.map((item, index) => ({
            ...item,
            email: `district_leader_${index + 1}@mail.ru`,
          }));

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
      'should be unprocessable entity after change bids statuses',
      () => {
        const server = app.getHttpServer();

        const shouldByUnprocessableEntityByClientId = [
          {
            ...getObjWithoutFields<any, any>(
              MOCK_STATIONS_WORKERS_MAP.WORKER_1,
              ['password'],
            ),
            clientId: 2,
          },
          {
            ...getObjWithoutFields<any, any>(
              MOCK_STATIONS_WORKERS_MAP.WORKER_2,
              ['password'],
            ),
            clientId: 4,
          },
        ];

        const shouldByUnprocessableEntityByStationId = [
          {
            ...getObjWithoutFields<any, any>(
              MOCK_STATIONS_WORKERS_MAP.WORKER_3,
              ['password'],
            ),
            clientId: 2,
            stationId: 7,
          },
          {
            ...getObjWithoutFields<any, any>(
              MOCK_STATIONS_WORKERS_MAP.WORKER_6,
              ['password'],
            ),
            stationId: 1,
          },
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
              users: shouldByUnprocessableEntityByClientId,
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
              users: shouldByUnprocessableEntityByStationId,
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
          ...TEST_USERS_UPDATE_STATIONS_WORKERS.map((item, index) => ({
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
              users: TEST_USERS_UPDATE_STATIONS_WORKERS,
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.CREATED);
              expect(body).toStrictEqual(
                TEST_USERS_UPDATE_STATIONS_WORKERS.map((item) => ({
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
              users: TEST_USERS_UPDATE_ENGINEERS,
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.CREATED);
              expect(body).toStrictEqual(
                TEST_USERS_UPDATE_ENGINEERS.map((item) => ({
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
  });

  afterAll(async () => {
    await app.close();
  });
});
