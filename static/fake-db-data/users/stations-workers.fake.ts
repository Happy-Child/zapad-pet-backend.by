import { UserEntity } from '@app/entities';
import { USER_ROLES } from 'src/modules/users/constants';
import { FAKE_USER_DEFAULT_PASSWORD } from '../constants';

// 8 entities
// ids 1 - 8
const stationWorkers: Partial<UserEntity>[] = [
  {
    name: 'station_worker_1',
    email: 'station_worker_1@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_2',
    email: 'station_worker_2@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_3',
    email: 'station_worker_3@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_4',
    email: 'station_worker_4@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_5',
    email: 'station_worker_5@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_6',
    email: 'station_worker_6@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_7',
    email: 'station_worker_7@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'station_worker_8',
    email: 'station_worker_8@mail.ru',
    role: USER_ROLES.STATION_WORKER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
];

export default stationWorkers;
