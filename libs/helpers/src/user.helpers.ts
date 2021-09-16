import { USER_ROLES } from '@app/constants';
import {
  GeneralUserAccountant,
  GeneralUserDistrictLeader,
  GeneralUserEngineer,
  GeneralUserStationWorker,
} from '@app/interfaces';

interface GetFilteredGeneralUsers {
  districtLeaders: GeneralUserDistrictLeader[];
  engineers: GeneralUserEngineer[];
  stationWorkers: GeneralUserStationWorker[];
  accountants: GeneralUserAccountant[];
}
export const getFilteredGeneralUsers = (
  rawUsers: { role: USER_ROLES }[],
): GetFilteredGeneralUsers => {
  const result: GetFilteredGeneralUsers = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    accountants: [],
  };

  rawUsers.forEach((user) => {
    switch (user.role) {
      case USER_ROLES.ACCOUNTANT:
        result.accountants.push(user as GeneralUserAccountant);
        break;
      case USER_ROLES.DISTRICT_LEADER:
        result.districtLeaders.push(user as GeneralUserDistrictLeader);
        break;
      case USER_ROLES.ENGINEER:
        result.engineers.push(user as GeneralUserEngineer);
        break;
      case USER_ROLES.STATION_WORKER:
        result.stationWorkers.push(user as GeneralUserStationWorker);
        break;
    }
  });

  return result;
};
