import { USER_ROLES } from '../../../../../src/modules/users/constants';
import { AllowedRoles } from '../../../../../src/modules/users/types';
import { groupedByConditions } from '@app/helpers/grouped.helpers/grouped-by-conditions';

export const groupedByRoles = <
  S extends { role: USER_ROLES.STATION_WORKER } = {
    role: USER_ROLES.STATION_WORKER;
  },
  D extends { role: USER_ROLES.DISTRICT_LEADER } = {
    role: USER_ROLES.DISTRICT_LEADER;
  },
  E extends { role: USER_ROLES.ENGINEER } = { role: USER_ROLES.ENGINEER },
  A extends { role: USER_ROLES.ACCOUNTANT } = { role: USER_ROLES.ACCOUNTANT },
>(
  arr: { role: AllowedRoles }[],
): {
  stationsWorkers: S[];
  districtsLeaders: D[];
  engineers: E[];
  accountants: A[];
} => {
  const stationsWorkers = groupedByConditions(arr, [
    ({ role }) => role === USER_ROLES.STATION_WORKER,
  ])[0] as unknown as S[];
  const districtsLeaders = groupedByConditions(arr, [
    ({ role }) => role === USER_ROLES.DISTRICT_LEADER,
  ])[0] as unknown as D[];
  const engineers = groupedByConditions(arr, [
    ({ role }) => role === USER_ROLES.ENGINEER,
  ])[0] as unknown as E[];
  const accountants = groupedByConditions(arr, [
    ({ role }) => role === USER_ROLES.ACCOUNTANT,
  ])[0] as unknown as A[];

  return {
    stationsWorkers,
    districtsLeaders,
    engineers,
    accountants,
  };
};
