import { USER_ROLES } from '../constants';
import { AllowedRolesType } from '../types';

interface IGetGroupedUsersByRoles<D, E, S, A> {
  districtLeaders: (D & { index: number })[];
  engineers: (E & { index: number })[];
  stationWorkers: (S & { index: number })[];
  accountants: (A & { index: number })[];
}
export const getGroupedUsersByRoles = <
  D extends { role: USER_ROLES.DISTRICT_LEADER } = {
    role: USER_ROLES.DISTRICT_LEADER;
  },
  E extends { role: USER_ROLES.ENGINEER } = { role: USER_ROLES.ENGINEER },
  S extends { role: USER_ROLES.STATION_WORKER } = {
    role: USER_ROLES.STATION_WORKER;
  },
  A extends { role: USER_ROLES.ACCOUNTANT } = { role: USER_ROLES.ACCOUNTANT },
>(
  rawUsers: { role: AllowedRolesType }[],
): IGetGroupedUsersByRoles<D, E, S, A> => {
  const result: IGetGroupedUsersByRoles<D, E, S, A> = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    accountants: [],
  };

  rawUsers.forEach((user, index) => {
    if (user.role === USER_ROLES.DISTRICT_LEADER) {
      result.districtLeaders.push({ ...(user as D), index });
    }
    if (user.role === USER_ROLES.ENGINEER) {
      result.engineers.push({ ...(user as E), index });
    }
    if (user.role === USER_ROLES.STATION_WORKER) {
      result.stationWorkers.push({ ...(user as S), index });
    }
    if (user.role === USER_ROLES.ACCOUNTANT) {
      result.accountants.push({ ...(user as A), index });
    }
  });

  return result;
};
