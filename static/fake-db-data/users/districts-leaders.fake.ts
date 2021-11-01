import { UserEntity } from '@app/entities';
import { USER_ROLES } from '../../../src/modules/users/constants';
import { FAKE_USER_DEFAULT_PASSWORD } from '../constants';

// 5 entities
// ids 9 - 13
const districtsLeaders: Partial<UserEntity>[] = [
  {
    name: 'district_leader_1',
    email: 'district_leader_1@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'district_leader_2',
    email: 'district_leader_2@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'district_leader_3',
    email: 'district_leader_3@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'district_leader_4',
    email: 'district_leader_4@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'district_leader_5',
    email: 'district_leader_5@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
];

export default districtsLeaders;
