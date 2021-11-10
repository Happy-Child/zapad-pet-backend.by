import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { USER_ROLES } from '../../src/modules/users/constants';
import stationWorkers from './users/stations-workers.fake';
import districtsLeaders from './users/districts-leaders.fake';
import engineers from './users/engineers.fake';
import { FAKE_USER_DEFAULT_PASSWORD } from './constants';

const data: Partial<
  UserEntity & StationWorkerEntity & DistrictLeaderEntity & EngineerEntity
>[] = [
  ...stationWorkers,
  ...districtsLeaders,
  ...engineers,
  {
    name: 'master',
    email: 'master@mail.ru',
    role: USER_ROLES.MASTER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'accountant',
    email: 'accountant@mail.ru',
    role: USER_ROLES.ACCOUNTANT,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
];

export default data;
