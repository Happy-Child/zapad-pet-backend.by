import { USER_ROLES } from '../../../src/modules/users/constants';
import { FAKE_USER_DEFAULT_PASSWORD } from '../constants';
import { UserEntity } from '@app/entities';

// 16 entities
// ids 14 - 29
const engineers: Partial<UserEntity>[] = [
  {
    name: 'engineer_1',
    email: 'engineer_1@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_2',
    email: 'engineer_2@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_3',
    email: 'engineer_3@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_4',
    email: 'engineer_4@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_5',
    email: 'engineer_5@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_6',
    email: 'engineer_6@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_7',
    email: 'engineer_7@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_8',
    email: 'engineer_8@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_9',
    email: 'engineer_9@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_10',
    email: 'engineer_10@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_11',
    email: 'engineer_11@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_12',
    email: 'engineer_12@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_13',
    email: 'engineer_13@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_14',
    email: 'engineer_14@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_15',
    email: 'engineer_15@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
  {
    name: 'engineer_16',
    email: 'engineer_16@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    password: FAKE_USER_DEFAULT_PASSWORD,
  },
];

export default engineers;
