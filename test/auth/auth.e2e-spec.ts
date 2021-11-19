import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { FAKE_STATIONS_WORKERS_MAP, FAKE_USER_PASSWORD } from '@app/constants';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import {
  TEST_SIGN_IN_SHOULD_FORBIDDEN,
  TEST_SIGN_IN_SHOULD_SUCCESS,
} from './test-auth.contants';
import { COOKIE } from '../../src/modules/auth/constants';
import { JwtService } from '@nestjs/jwt';
import { getTestAccessTokens } from './test-auth.helpers';
import { bootstrapTestApp } from '../test.helpers';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let accessTokens: {
    fromStationWorker1: string;
    fromStationWorker7: string;
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = await bootstrapTestApp(moduleRef);
    accessTokens = getTestAccessTokens(app.get(JwtService));
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
              password: FAKE_USER_PASSWORD,
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
              password: FAKE_USER_PASSWORD,
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
            password: FAKE_USER_PASSWORD,
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
            email: FAKE_STATIONS_WORKERS_MAP.WORKER_4.email,
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
          .send({ password: FAKE_USER_PASSWORD })
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
      'response status should be 401',
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
      'response status should be 403',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokens.fromStationWorker7};`,
          )
          .expect(({ status }) => {
            expect(status).toBe(HttpStatus.FORBIDDEN);
          });
      },
      TEST_TIMEOUT,
    );

    it(
      'response status should be 200',
      () => {
        const server = app.getHttpServer();

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokens.fromStationWorker1};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual({
              ...FAKE_STATIONS_WORKERS_MAP.WORKER_1,
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
