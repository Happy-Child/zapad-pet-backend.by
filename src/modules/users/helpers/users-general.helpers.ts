import { AllowedRoles } from '../types';
import { USER_ROLES } from '@app/constants';

interface IFullDistrictLeader {
  role: USER_ROLES.DISTRICT_LEADER;
  leaderDistrictId: number;
}

interface IFullEngineer {
  role: USER_ROLES.ENGINEER;
  engineerDistrictId: number;
}

interface IFullStationWorker {
  role: USER_ROLES.STATION_WORKER;
  clientId: number;
  stationId: number | null;
}

interface IRawUser {
  role: AllowedRoles;
  clientId?: number | null;
  stationId?: number | null;
  leaderDistrictId?: number | null;
  engineerDistrictId?: number | null;
}

interface IGetGroupedFullUsersByRoles<D, E, S, A> {
  districtLeaders: D[];
  engineers: E[];
  stationWorkers: S[];
  simpleUsers: A[];
}
export const getGroupedFullUsersByRoles = <
  D extends IFullDistrictLeader,
  E extends IFullEngineer,
  S extends IFullStationWorker,
  A extends { role: AllowedRoles } = { role: AllowedRoles },
>(
  rawUsers: IRawUser[],
): IGetGroupedFullUsersByRoles<D, E, S, A> => {
  const result: IGetGroupedFullUsersByRoles<D, E, S, A> = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    simpleUsers: [],
  };

  rawUsers.forEach((user) => {
    if (user.role === USER_ROLES.DISTRICT_LEADER && user.leaderDistrictId) {
      result.districtLeaders.push(user as D);
      return;
    }
    if (user.role === USER_ROLES.ENGINEER && user.engineerDistrictId) {
      result.engineers.push(user as E);
      return;
    }
    if (user.role === USER_ROLES.STATION_WORKER && user.clientId) {
      result.stationWorkers.push(user as S);
      return;
    }
    result.simpleUsers.push(user as A);
  });

  return result;
};
