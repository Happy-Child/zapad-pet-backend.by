import { DistrictLeaderEntity, UserEntity } from '@app/entities';
import { USER_ROLES } from '../../../src/modules/users/constants';
import { FAKE_USER_DEFAULT_PASSWORD } from '../constants';

// 7 entities
const districtsLeaders: Partial<UserEntity & DistrictLeaderEntity>[] = [
  {
    name: 'district_leader_1',
    email: 'district_leader_1@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: 1,
  },
  {
    name: 'district_leader_2',
    email: 'district_leader_2@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: 75,
  },
  {
    name: 'district_leader_3',
    email: 'district_leader_3@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: 3,
  },
  {
    name: 'district_leader_4',
    email: 'district_leader_4@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: 4,
  },
  {
    name: 'district_leader_5',
    email: 'district_leader_5@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: null,
  },
  {
    name: 'district_leader_6',
    email: 'district_leader_6@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: 5,
  },
  {
    name: 'district_leader_7',
    email: 'district_leader_7@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
    districtId: null,
  },
];

export default districtsLeaders;
