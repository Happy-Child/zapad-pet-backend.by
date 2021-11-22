import { USER_ROLES } from '@app/constants';
import { MOCK_USER_PASSWORD } from '../../../static/mock-data/users/mock.constants';

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
