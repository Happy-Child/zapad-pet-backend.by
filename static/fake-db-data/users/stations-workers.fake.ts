import { StationWorkerEntity, UserEntity } from '@app/entities';
import { USER_ROLES } from 'src/modules/users/constants';
import { FAKE_USER_DEFAULT_PASSWORD } from '../constants';

// 9 entities
const stationWorkers: Partial<UserEntity & StationWorkerEntity>[] = [
  {
    name: 'station_worker_1',
    email: 'station_worker_1@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 1,
    stationId: 2,
  },
  {
    name: 'station_worker_2',
    email: 'station_worker_2@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 1,
    stationId: 3,
  },
  {
    name: 'station_worker_3',
    email: 'station_worker_3@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 1,
    stationId: null,
  },
  {
    name: 'station_worker_4',
    email: 'station_worker_4@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 2,
    stationId: 6,
  },
  {
    name: 'station_worker_5',
    email: 'station_worker_5@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 2,
    stationId: 7,
  },
  {
    name: 'station_worker_6',
    email: 'station_worker_6@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 3,
    stationId: 8,
  },
  {
    name: 'station_worker_7',
    email: 'station_worker_7@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: 4,
    stationId: 12,
  },
  {
    name: 'station_worker_8',
    email: 'station_worker_8@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: null,
    stationId: null,
  },
  {
    name: 'station_worker_9',
    email: 'station_worker_9@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    clientId: null,
    stationId: null,
  },
];

export default stationWorkers;
