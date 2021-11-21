import qs from 'querystring';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import { JwtService } from '@nestjs/jwt';
import { bootstrapTestApp, getTestAccessTokensByRoles } from '../test.helpers';
import { COOKIE } from '../../src/modules/auth/constants';
import { MOCK_ENGINEERS_MAP } from '../../static/mock-data/users/engineers.mock';
import { ENTITIES_FIELDS, SORT_DURATION, USER_ROLES } from '@app/constants';
import { MOCK_CLIENTS_MAP } from '../../static/mock-data/clients/clients.mock';

const totalClientCount = Object.keys(MOCK_CLIENTS_MAP).length;

describe('ClientsModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService), {
      engineerId: MOCK_ENGINEERS_MAP.ENGINEER_4.id!,
    });
  });

  describe('GET /clients', () => {
    const API_URL = '/clients';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles).map((role) =>
          request(server)
            .get(`${API_URL}?take=1`)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[role as USER_ROLES]
              };`,
            )
            .expect(({ status }) => {
              expect(status).toBe(
                role === USER_ROLES.MASTER
                  ? HttpStatus.OK
                  : HttpStatus.FORBIDDEN,
              );
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
                take: 2,
                sortBy: ENTITIES_FIELDS.STATIONS_COUNT,
              })}`,
            )
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .expect(({ body }) => {
              expect(body).toStrictEqual({
                totalItemsCount: totalClientCount,
                items: [
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_2,
                    stationsCount: 4,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_3,
                    stationsCount: 3,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                ],
                take: 2,
                skip: 0,
              });
            }),
          request(server)
            .get(
              `${API_URL}?${qs.stringify({
                take: 1,
                skip: 3,
                sortDuration: SORT_DURATION.ASC,
                sortBy: ENTITIES_FIELDS.NAME,
              })}`,
            )
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .expect(({ body }) => {
              expect(body).toStrictEqual({
                totalItemsCount: totalClientCount,
                items: [
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_2,
                    stationsCount: 4,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                ],
                take: 1,
                skip: 3,
              });
            }),
          request(server)
            .get(
              `${API_URL}?${qs.stringify({
                take: 12,
                searchByName: 'compa',
                sortDuration: SORT_DURATION.ASC,
                sortBy: ENTITIES_FIELDS.NAME,
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
                totalItemsCount: totalClientCount,
                items: [
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_4,
                    stationsCount: 2,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_3,
                    stationsCount: 3,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                  {
                    ...MOCK_CLIENTS_MAP.CLIENT_2,
                    stationsCount: 4,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                ],
                take: 12,
                skip: 0,
              });
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /clients/:id', () => {
    const API_URL = '/clients';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles).map((role) =>
          request(server)
            .get(`${API_URL}/1`)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[role as USER_ROLES]
              };`,
            )
            .expect(({ status }) => {
              expect(status).toBe(
                role === USER_ROLES.MASTER
                  ? HttpStatus.OK
                  : HttpStatus.FORBIDDEN,
              );
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
          .get(`${API_URL}/1`)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ body }) => {
            expect(body).toStrictEqual({
              ...MOCK_CLIENTS_MAP.CLIENT_1,
              stationsCount: 3,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      },
      TEST_TIMEOUT,
    );
  });

  describe('POST /clients/:id', () => {
    const API_URL = '/clients';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles).map((role) =>
          request(server)
            .post(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[role as USER_ROLES]
              };`,
            )
            .send({ name: 'new client best' })
            .expect(({ status }) => {
              expect(status).toBe(
                role === USER_ROLES.MASTER
                  ? HttpStatus.OK
                  : HttpStatus.FORBIDDEN,
              );
            }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );
  });

  describe('PUT /clients/:id', () => {
    const API_URL = '/clients';

    it(
      'should be forbidden all roles except master',
      () => {
        const server = app.getHttpServer();

        const requests = Object.keys(accessTokensByRoles).map((role) =>
          request(server)
            .put(`${API_URL}/1`)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[role as USER_ROLES]
              };`,
            )
            .send({ name: 'update name client 1' })
            .expect(({ status }) => {
              expect(status).toBe(
                role === USER_ROLES.MASTER
                  ? HttpStatus.CREATED
                  : HttpStatus.FORBIDDEN,
              );
            }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
