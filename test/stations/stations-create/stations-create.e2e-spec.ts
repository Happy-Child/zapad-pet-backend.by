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
import { TEST_STATIONS_CREATE_ITEMS } from './stations-create.test-constants';

describe('StationsModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('POST /stations', () => {
    const API_URL = '/stations';

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
      'should be bad request',
      () => {
        const server = app.getHttpServer();

        const shouldBeErrorByNumber = TEST_STATIONS_CREATE_ITEMS.map(
          (item) => ({
            ...item,
            number: '12345678',
          }),
        );

        const shouldBeErrorByWorkerId = TEST_STATIONS_CREATE_ITEMS.map(
          (item) => ({
            ...item,
            stationWorkerId: 5,
          }),
        );

        const requests = [shouldBeErrorByNumber, shouldBeErrorByWorkerId].map(
          (stations) =>
            request(server)
              .post(API_URL)
              .set(
                'Cookie',
                `${COOKIE.ACCESS_TOKEN}=${
                  accessTokensByRoles[USER_ROLES.MASTER]
                };`,
              )
              .send({
                stations,
              })
              .expect(({ status }) => {
                expect(status).toBe(HttpStatus.BAD_REQUEST);
              }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be unprocessable entity',
      () => {
        const server = app.getHttpServer();

        const shouldBeErrorByNumber = [
          {
            ...TEST_STATIONS_CREATE_ITEMS[0],
            number: 'NMB0000001',
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[1],
            number: 'NMB0000002',
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[2],
            number: 'NMB0000003',
          },
        ];

        const shouldBeErrorByWorkerAndClientId1 = [
          {
            ...TEST_STATIONS_CREATE_ITEMS[0],
            clientId: 3,
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[1],
            clientId: 3,
            stationWorkerId: 8,
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[2],
            clientId: 3,
            stationWorkerId: 9,
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[3],
            clientId: 3,
            stationWorkerId: 7,
          },
        ];

        const shouldBeErrorByWorkerAndClientId2 = [
          {
            ...TEST_STATIONS_CREATE_ITEMS[0],
            clientId: 1,
            stationWorkerId: 1,
          },
          {
            ...TEST_STATIONS_CREATE_ITEMS[1],
            clientId: 1,
            stationWorkerId: 2,
          },
        ];

        const requests = [
          shouldBeErrorByNumber,
          shouldBeErrorByWorkerAndClientId1,
          shouldBeErrorByWorkerAndClientId2,
        ].map((stations) =>
          request(server)
            .post(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              stations,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be not found',
      () => {
        const server = app.getHttpServer();

        const shouldBeErrorByDistrictId = TEST_STATIONS_CREATE_ITEMS.map(
          (item) => ({
            ...item,
            stationWorkerId: null,
            districtId: 999,
          }),
        );

        const shouldBeErrorByClientId = TEST_STATIONS_CREATE_ITEMS.map(
          (item) => ({
            ...item,
            stationWorkerId: null,
            clientId: 999,
          }),
        );

        const requests = [
          shouldBeErrorByDistrictId,
          shouldBeErrorByClientId,
        ].map((stations) =>
          request(server)
            .post(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .send({
              stations,
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.NOT_FOUND);
            }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'should be create stations',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .post(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .send({
            stations: TEST_STATIONS_CREATE_ITEMS,
          })
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual(
              TEST_STATIONS_CREATE_ITEMS.map((item) => ({
                ...item,
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              })),
            );
          });
      },
      TEST_TIMEOUT,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
