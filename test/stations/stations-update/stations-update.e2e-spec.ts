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

    it.skip(
      'should be bad request',
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
              stations: [],
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.BAD_REQUEST);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it.skip(
      'should be unprocessable entity',
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
              stations: [],
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it.skip(
      'should be not found',
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
              stations: [],
            })
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.NOT_FOUND);
            }),
        ];

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it.skip(
      'should be update stations',
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
              stations: [],
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual([]);
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
