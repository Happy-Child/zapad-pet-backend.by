import { HttpStatus, INestApplication } from '@nestjs/common';
import qs from 'querystring';
import request from 'supertest';
import { TEST_TIMEOUT } from '@app/constants/tests.constants';
import { JwtService } from '@nestjs/jwt';
import {
  bootstrapTestApp,
  getTestAccessTokensByRoles,
} from '../../test.helpers';
import { COOKIE } from '../../../src/modules/auth/constants';
import { USER_ROLES } from '@app/constants';
import { PaginationResponseDTO } from '@app/dtos';
import { StationDTO } from '../../../src/modules/stations/dtos/stations-getting.dtos';

describe('StationsModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('GET /stations', () => {
    const API_URL = '/stations';

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

    // TODO impl tests
    it.skip(
      'should be bad request',
      () => {
        const server = app.getHttpServer();

        const shouldBeSuccess: {
          query: Record<string, string | number | string[] | number[]>;
          result: PaginationResponseDTO<StationDTO>;
        }[] = [
          {
            query: { take: 5 },
            result: {
              totalItemsCount: 0,
              take: 5,
              skip: 0,
              items: [],
            },
          },
          {
            query: { take: 5 },
            result: {
              totalItemsCount: 0,
              take: 5,
              skip: 0,
              items: [],
            },
          },
          {
            query: { take: 5 },
            result: {
              totalItemsCount: 0,
              take: 5,
              skip: 0,
              items: [],
            },
          },
        ];

        const requests = shouldBeSuccess.map(({ query, result }) =>
          request(server)
            .get(`${API_URL}?${qs.stringify(query)}`)
            .set(
              'Cookie',
              `${COOKIE.ACCESS_TOKEN}=${
                accessTokensByRoles[USER_ROLES.MASTER]
              };`,
            )
            .expect(({ status, body }) => {
              expect(status).toBe(HttpStatus.OK);
              expect(body).toStrictEqual(result);
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
