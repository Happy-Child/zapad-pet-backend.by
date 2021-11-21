import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import {
  TEST_SIGN_IN_SHOULD_FORBIDDEN,
  TEST_SIGN_IN_SHOULD_SUCCESS,
} from './test-auth.contants';
import { COOKIE } from '../../src/modules/auth/constants';
import { JwtService } from '@nestjs/jwt';
import { getTestAuthAccessTokens } from './test-auth.helpers';
import { bootstrapTestApp } from '../test.helpers';
import { MOCK_USER_PASSWORD } from '../../static/mock-data/users/mock.constants';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let accessTokens: {
    fromStationWorker1: string;
    fromStationWorker7: string;
  };

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokens = getTestAuthAccessTokens(app.get(JwtService));
  });

  describe('POST /auth/sign-in', () => {
    const API_URL = '/auth/sign-in';

    it(
      'response status should be 200',
      () => {
        const server = app.getHttpServer();

        const requests = TEST_SIGN_IN_SHOULD_SUCCESS.map((user) =>
          request(server)
            .post(API_URL)
            .send({
              email: user.email,
              password: MOCK_USER_PASSWORD,
            })
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual({
                user: {
                  ...user,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                accessToken: expect.any(String),
              });
            }),
        );

        return Promise.all(requests);
      },
      TEST_TIMEOUT,
    );

    it(
      'response status should be 403',
      () => {
        const server = app.getHttpServer();

        const requests = TEST_SIGN_IN_SHOULD_FORBIDDEN.map((worker) =>
          request(server)
            .post(API_URL)
            .send({
              email: worker.email,
              password: MOCK_USER_PASSWORD,
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
      'response status should be 404',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .post(API_URL)
          .send({
            email: 'not_existing_email@mail.ru',
            password: MOCK_USER_PASSWORD,
          })
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.NOT_FOUND);
          });
      },
      TEST_TIMEOUT,
    );

    it(
      'response status should be 422',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .post(API_URL)
          .send({
            email: MOCK_STATIONS_WORKERS_MAP.WORKER_4.email,
            password: 'invalidpass124',
          })
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
          });
      },
      TEST_TIMEOUT,
    );

    it(
      'response status should be 400',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .post(API_URL)
          .send({ password: MOCK_USER_PASSWORD })
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.BAD_REQUEST);
          });
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /auth/me', () => {
    const API_URL = '/auth/me';

    it(
      'should be blocked users with invalid token',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .get(API_URL)
          .set('Cookie', `${COOKIE.ACCESS_TOKEN}=invalid_token;`)
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.UNAUTHORIZED);
          });
      },
      TEST_TIMEOUT,
    );

    it(
      'should be allowed full users',
      () => {
        const server = app.getHttpServer();

        const requests = [
          request(server)
            .get(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${accessTokens.fromStationWorker7};`,
            )
            .expect(({ status }) => {
              expect(status).toBe(HttpStatus.FORBIDDEN);
            }),
          request(server)
            .get(API_URL)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${accessTokens.fromStationWorker1};`,
            )
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual({
                ...MOCK_STATIONS_WORKERS_MAP.WORKER_1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              });
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
