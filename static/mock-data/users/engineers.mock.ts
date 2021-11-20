import { EngineerEntity, UserEntity } from '@app/entities';
import { USER_ROLES } from '@app/constants';

export const MOCK_ENGINEERS_MAP: Record<
  string,
  Partial<UserEntity & EngineerEntity>
> = {
  ENGINEER_1: {
    id: 17,
    name: 'engineer_1',
    email: 'engineer_1@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 1,
  },
  ENGINEER_2: {
    id: 18,
    name: 'engineer_2',
    email: 'engineer_2@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: false,
    engineerDistrictId: 1,
  },
  ENGINEER_3: {
    id: 19,
    name: 'engineer_3',
    email: 'engineer_3@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 110,
  },
  ENGINEER_4: {
    id: 20,
    name: 'engineer_4',
    email: 'engineer_4@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: false,
    engineerDistrictId: 5,
  },
  ENGINEER_5: {
    id: 21,
    name: 'engineer_5',
    email: 'engineer_5@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 7,
  },
  ENGINEER_6: {
    id: 22,
    name: 'engineer_6',
    email: 'engineer_6@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 25,
  },
  ENGINEER_7: {
    id: 23,
    name: 'engineer_7',
    email: 'engineer_7@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 45,
  },
  ENGINEER_8: {
    id: 24,
    name: 'engineer_8',
    email: 'engineer_8@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 90,
  },
  ENGINEER_9: {
    id: 25,
    name: 'engineer_9',
    email: 'engineer_9@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: 90,
  },
  ENGINEER_10: {
    id: 26,
    name: 'engineer_10',
    email: 'engineer_10@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: false,
    engineerDistrictId: 50,
  },
  ENGINEER_11: {
    id: 27,
    name: 'engineer_11',
    email: 'engineer_11@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: false,
    engineerDistrictId: null,
  },
  ENGINEER_12: {
    id: 28,
    name: 'engineer_12',
    email: 'engineer_12@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: null,
  },
  ENGINEER_13: {
    id: 29,
    name: 'engineer_13',
    email: 'engineer_13@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: null,
  },
  ENGINEER_14: {
    id: 30,
    name: 'engineer_14',
    email: 'engineer_14@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: false,
    engineerDistrictId: null,
  },
  ENGINEER_15: {
    id: 31,
    name: 'engineer_15',
    email: 'engineer_15@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: null,
  },
  ENGINEER_16: {
    id: 32,
    name: 'engineer_16',
    email: 'engineer_16@mail.ru',
    role: USER_ROLES.ENGINEER,
    emailConfirmed: true,
    engineerDistrictId: null,
  },
};
