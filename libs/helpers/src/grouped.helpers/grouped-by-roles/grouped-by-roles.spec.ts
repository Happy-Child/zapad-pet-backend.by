import { groupedByRoles } from './index';
import { USER_ROLES } from '@app/constants';

const mockData = [
  {
    id: 1,
    role: USER_ROLES.ENGINEER,
  },
  {
    id: 2,
    role: USER_ROLES.STATION_WORKER,
  },
  {
    id: 3,
    role: USER_ROLES.STATION_WORKER,
  },
  {
    id: 4,
    role: USER_ROLES.STATION_WORKER,
  },
  {
    id: 5,
    role: USER_ROLES.ENGINEER,
  },
  {
    id: 6,
    role: USER_ROLES.DISTRICT_LEADER,
  },
  {
    id: 7,
    role: USER_ROLES.DISTRICT_LEADER,
  },
  {
    id: 8,
    role: USER_ROLES.DISTRICT_LEADER,
  },
  {
    id: 9,
    role: USER_ROLES.ACCOUNTANT,
  },
  {
    id: 10,
    role: USER_ROLES.ACCOUNTANT,
  },
];

describe('groupedByRoles', () => {
  it('should return object with grouped users by roles', () => {
    expect(groupedByRoles(mockData)).toStrictEqual({
      stationsWorkers: [
        {
          id: 2,
          role: USER_ROLES.STATION_WORKER,
        },
        {
          id: 3,
          role: USER_ROLES.STATION_WORKER,
        },
        {
          id: 4,
          role: USER_ROLES.STATION_WORKER,
        },
      ],
      districtsLeaders: [
        {
          id: 6,
          role: USER_ROLES.DISTRICT_LEADER,
        },
        {
          id: 7,
          role: USER_ROLES.DISTRICT_LEADER,
        },
        {
          id: 8,
          role: USER_ROLES.DISTRICT_LEADER,
        },
      ],
      engineers: [
        {
          id: 1,
          role: USER_ROLES.ENGINEER,
        },
        {
          id: 5,
          role: USER_ROLES.ENGINEER,
        },
      ],
      accountants: [
        {
          id: 9,
          role: USER_ROLES.ACCOUNTANT,
        },
        {
          id: 10,
          role: USER_ROLES.ACCOUNTANT,
        },
      ],
    });
  });
});
