import {
  DistrictLeaderEntity,
  UserEntity,
} from '@app/entities';
import { USER_ROLES } from '@app/constants';

export const MOCK_DISTRICTS_LEADERS_MAP: Record<
  string,
  Partial<UserEntity & DistrictLeaderEntity>
> = {
  LEADER_1: {
    id: 10,
    name: 'district_leader_1',
    email: 'district_leader_1@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    leaderDistrictId: 1,
  },
  LEADER_2: {
    id: 11,
    name: 'district_leader_2',
    email: 'district_leader_2@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: false,
    leaderDistrictId: 75,
  },
  LEADER_3: {
    id: 12,
    name: 'district_leader_3',
    email: 'district_leader_3@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    leaderDistrictId: 3,
  },
  LEADER_4: {
    id: 13,
    name: 'district_leader_4',
    email: 'district_leader_4@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: false,
    leaderDistrictId: 4,
  },
  LEADER_5: {
    id: 14,
    name: 'district_leader_5',
    email: 'district_leader_5@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    leaderDistrictId: null,
  },
  LEADER_6: {
    id: 15,
    name: 'district_leader_6',
    email: 'district_leader_6@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: true,
    leaderDistrictId: 5,
  },
  LEADER_7: {
    id: 16,
    name: 'district_leader_7',
    email: 'district_leader_7@mail.ru',
    role: USER_ROLES.DISTRICT_LEADER,
    emailConfirmed: false,
    leaderDistrictId: null,
  },
};
