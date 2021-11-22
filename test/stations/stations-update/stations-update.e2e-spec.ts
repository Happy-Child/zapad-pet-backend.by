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
import { MOCK_STATIONS_MAP } from '../../../static/mock-data/stations/stations.mock';
import { MOCK_STATIONS_WORKERS_MAP } from '../../../static/mock-data/users/stations-workers.mock';

describe('StationsModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('PUT /stations', () => {
    const API_URL = '/stations';

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

        const shouldBeErrorById = [
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_2,
          MOCK_STATIONS_MAP.STATION_2,
          MOCK_STATIONS_MAP.STATION_5,
          MOCK_STATIONS_MAP.STATION_5,
        ].map((item) => ({ ...item, stationWorkerId: null }));

        const shouldBeClientId = [
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_2,
          MOCK_STATIONS_MAP.STATION_5,
        ].map((item) => ({ ...item, stationWorkerId: null, clientId: null }));

        const shouldBeStationId = [
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_2,
          MOCK_STATIONS_MAP.STATION_5,
        ].map((item) => ({ ...item, stationWorkerId: 5 }));

        const shouldBeNumber = [
          MOCK_STATIONS_MAP.STATION_1,
          MOCK_STATIONS_MAP.STATION_2,
          MOCK_STATIONS_MAP.STATION_5,
        ].map((item) => ({
          ...item,
          stationWorkerId: null,
          number: '12345678',
        }));

        const requests = [
          shouldBeErrorById,
          shouldBeClientId,
          shouldBeStationId,
          shouldBeNumber,
        ].map((stations) =>
          request(server)
            .put(API_URL)
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
            ...MOCK_STATIONS_MAP.STATION_1,
            number: 'NMB0000002',
          },
          {
            ...MOCK_STATIONS_MAP.STATION_3,
            number: 'NMB0000001',
          },
          {
            ...MOCK_STATIONS_MAP.STATION_7,
            number: 'NMB0000004',
          },
        ].map((item) => ({ ...item, stationWorkerId: null }));

        const shouldBeErrorByClientOrWorkerId1 = [
          {
            ...MOCK_STATIONS_MAP.STATION_1,
            clientId: 4,
            stationWorkerId: null,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_4,
            clientId: 4,
            stationWorkerId: 3,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_7,
            clientId: 1,
            stationWorkerId: 8,
          },
        ];

        const shouldBeErrorByClientOrWorkerId2 = [
          {
            ...MOCK_STATIONS_MAP.STATION_1,
            clientId: 4,
            stationWorkerId: 7,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_2,
            clientId: 4,
            stationWorkerId: null,
          },
        ];

        const requests = [
          shouldBeErrorByNumber,
          shouldBeErrorByClientOrWorkerId1,
          shouldBeErrorByClientOrWorkerId2,
        ].map((stations) =>
          request(server)
            .put(API_URL)
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

        const shouldBeErrorById = [
          {
            ...MOCK_STATIONS_MAP.STATION_2,
            id: 120,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_5,
            id: 150,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            id: 180,
          },
        ].map((item) => ({ ...item, stationWorkerId: null }));

        const shouldBeErrorByDistrictId = [
          {
            ...MOCK_STATIONS_MAP.STATION_3,
            districtId: 1000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_5,
            districtId: 2000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            districtId: 3000,
          },
        ].map((item) => ({ ...item, stationWorkerId: null }));

        const shouldBeErrorByClientId = [
          {
            ...MOCK_STATIONS_MAP.STATION_3,
            clientId: 1000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_5,
            clientId: 2000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            clientId: 3000,
          },
        ].map((item) => ({ ...item, stationWorkerId: null }));

        const shouldBeErrorByWorkerId = [
          {
            ...MOCK_STATIONS_MAP.STATION_2,
            clientId: 1,
            stationWorkerId: 1000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_5,
            clientId: 2,
            stationWorkerId: 2000,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            clientId: 3,
            stationWorkerId: 3000,
          },
        ];

        const requests = [
          shouldBeErrorById,
          shouldBeErrorByDistrictId,
          shouldBeErrorByClientId,
          shouldBeErrorByWorkerId,
        ].map((stations) =>
          request(server)
            .put(API_URL)
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
      'should be update stations',
      () => {
        const server = app.getHttpServer();

        const stationsToUpdate1 = [
          {
            ...MOCK_STATIONS_MAP.STATION_1,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_4.id,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            stationWorkerId: null,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_11,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_7.id,
          },
        ];

        const stationsToUpdate2 = [
          {
            ...MOCK_STATIONS_MAP.STATION_2,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_2.id,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_3,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_1.id,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_6,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_5.id,
          },
          {
            ...MOCK_STATIONS_MAP.STATION_7,
            stationWorkerId: MOCK_STATIONS_WORKERS_MAP.WORKER_4.id,
          },
        ];

        const requests = [stationsToUpdate1, stationsToUpdate2].map(
          (stations) =>
            request(server)
              .put(API_URL)
              .set(
                'Cookie',
                `${COOKIE.ACCESS_TOKEN}=${
                  accessTokensByRoles[USER_ROLES.MASTER]
                };`,
              )
              .send({
                stations,
              })
              .expect(({ status, body }) => {
                expect(status).toBe(HttpStatus.CREATED);
                expect(body).toStrictEqual(
                  stations.map((item) => ({
                    ...item,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  })),
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
