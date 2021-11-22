import { USER_ROLES } from '@app/constants';
import { MOCK_USER_PASSWORD } from '../../static/mock-data/users/mock.constants';
import { getObjWithoutFields } from '@app/helpers';
import { MOCK_ENGINEERS_MAP } from '../../static/mock-data/users/engineers.mock';
import { MOCK_STATIONS_WORKERS_MAP } from '../../static/mock-data/users/stations-workers.mock';
import { MOCK_STATIONS_MAP } from '../../static/mock-data/stations/stations.mock';

export const TEST_USERS_TO_CREATE = [
  {
    id: 35,
    name: 'test sw 1',
    email: 'test_station_worker1@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    clientId: 4,
    stationId: 11,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 36,
    name: 'test sw 2',
    email: 'test_station_worker2@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    clientId: 4,
    stationId: null,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 37,
    name: 'test sw 3',
    email: 'test_station_worker3@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    clientId: null,
    stationId: null,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 38,
    name: 'test dl 1',
    email: 'test_district_leader1@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    leaderDistrictId: null,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 39,
    name: 'test dl 2',
    email: 'test_district_leader2@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    leaderDistrictId: 25,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 40,
    name: 'test e 1',
    email: 'test_engineer1@mail.ru',
    role: USER_ROLES.ENGINEER,
    engineerDistrictId: 25,
    password: MOCK_USER_PASSWORD,
  },
  {
    id: 41,
    name: 'test e 2',
    email: 'test_engineer2@mail.ru',
    role: USER_ROLES.ENGINEER,
    engineerDistrictId: null,
    password: MOCK_USER_PASSWORD,
  },
];

export const GET_USERS_VALID_RESPONSE_ITEMS = [
  {
    ...getObjWithoutFields<any, any>(TEST_USERS_TO_CREATE[6], ['password']),
    emailConfirmed: false,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(TEST_USERS_TO_CREATE[5], ['password']),
    emailConfirmed: false,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_9, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_8, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_7, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_6, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_5, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_4, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_3, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_2, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_16, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_15, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_14, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_13, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_12, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_11, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_10, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  {
    ...getObjWithoutFields<any, any>(MOCK_ENGINEERS_MAP.ENGINEER_1, [
      'password',
    ]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
];

export const UPDATE_STATIONS_WORKERS = [
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_6,
    clientId: null,
    stationId: null,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_8,
    clientId: MOCK_STATIONS_WORKERS_MAP.WORKER_6.clientId,
    stationId: MOCK_STATIONS_WORKERS_MAP.WORKER_6.stationId,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_7,
    stationId: MOCK_STATIONS_MAP.STATION_12.id,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_3,
    clientId: MOCK_STATIONS_MAP.STATION_10.clientId,
    stationId: MOCK_STATIONS_MAP.STATION_10.id,
  },
].sort((a, b) => a.id! - b.id!);

export const UPDATE_ENGINEERS = [
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_1,
    name: 'engineer 1 updated',
    email: 'engineer_updated_1@mail.ru',
  },
  MOCK_ENGINEERS_MAP.ENGINEER_2,
  MOCK_ENGINEERS_MAP.ENGINEER_3,
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_5,
    engineerDistrictId: null,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_7,
    engineerDistrictId: null,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_11,
    engineerDistrictId: MOCK_ENGINEERS_MAP.ENGINEER_7.engineerDistrictId,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_12,
    engineerDistrictId: MOCK_ENGINEERS_MAP.ENGINEER_7.engineerDistrictId,
  },
].sort((a, b) => a.id! - b.id!);
