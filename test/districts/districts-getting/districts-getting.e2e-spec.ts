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
import { INITIAL_DISTRICT_DATA_MAP } from '../../../static/initial-db-data/districts.initial';
import {
  DistrictStatisticDTO,
  DistrictWithStatisticsDTO,
} from '../../../src/modules/districts/dtos/districts-getting.dtos';
import { plainToClass } from 'class-transformer';
import { BidsCountByStatusesDTO } from '../../../src/modules/bids/dtos';
import { BID_STATUS } from '../../../src/modules/bids/constants';
import { ShortEngineerMemberDTO } from '../../../src/modules/engineers/dtos';

describe('DistrictsModule (e2e)', () => {
  let app: INestApplication;
  let accessTokensByRoles: Record<USER_ROLES, string>;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    accessTokensByRoles = getTestAccessTokensByRoles(app.get(JwtService));
  });

  describe('GET /districts/all', () => {
    const API_URL = '/districts/all';

    it(
      'should be valid response',
      () => {
        const server = app.getHttpServer();

        const validResponse = {
          totalItemsCount: INITIAL_DISTRICT_DATA_MAP.length,
          items: expect.any(Array),
        };

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual(validResponse);
          });
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /districts/:id', () => {
    const API_URL = '/districts/2';

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

        const validResponse: Partial<DistrictWithStatisticsDTO> = {
          id: expect.any(Number),
          slug: expect.any(String),
          name: expect.any(String),
          regionSlug: expect.any(String),
          countOfEngineers: expect.any(Number),
          countOfStations: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          districtLeader: expect.any(Object),
          statistics: expect.any(Object),
        };

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual(validResponse);
          });
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /districts/:id/statistics', () => {
    const API_URL = '/districts/2/statistics';

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

        const validResponse: DistrictStatisticDTO = {
          bidsCountByStatuses: {
            ...plainToClass(BidsCountByStatusesDTO, {}),
            [BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER]: 0,
          },
        };

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual(validResponse);
          });
      },
      TEST_TIMEOUT,
    );
  });

  describe('GET /districts/:id/engineers', () => {
    const API_URL = '/districts/1/engineers';

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

        const validResponse: ShortEngineerMemberDTO[] = [
          {
            id: expect.any(Number),
            email: expect.any(String),
            name: 'engineer_1',
          },
          {
            id: expect.any(Number),
            email: expect.any(String),
            name: 'engineer_2',
          },
        ];

        return request(server)
          .get(API_URL)
          .set(
            'Cookie',
            `${COOKIE.ACCESS_TOKEN}=${accessTokensByRoles[USER_ROLES.MASTER]};`,
          )
          .expect(({ status, body }) => {
            expect(status).toBe(HttpStatus.OK);
            expect(body).toStrictEqual(validResponse);
          });
      },
      TEST_TIMEOUT,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
