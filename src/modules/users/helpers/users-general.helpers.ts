import { USER_ROLES } from '../constants';
import { AllowedRoles } from '../types';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateStationWorkerDTO,
} from '../dtos';
import { ENTITIES_FIELDS } from '@app/constants';

type FullDistrictLeader = Pick<
  UsersCreateDistrictLeaderDTO,
  ENTITIES_FIELDS.DISTRICT_ID | ENTITIES_FIELDS.ROLE
>;

type FullEngineer = Pick<
  UsersCreateEngineerDTO,
  ENTITIES_FIELDS.DISTRICT_ID | ENTITIES_FIELDS.ROLE
>;

type FullStationWorker = Pick<
  UsersCreateStationWorkerDTO,
  ENTITIES_FIELDS.CLIENT_ID | ENTITIES_FIELDS.ROLE
>;

interface IRawUser {
  role: AllowedRoles;
  clientId?: number;
  districtId?: number;
}

interface IGetGroupedFullUsersByRoles<D, E, S, A> {
  districtLeaders: (D & { index: number })[];
  engineers: (E & { index: number })[];
  stationWorkers: (S & { index: number })[];
  simpleUsers: (A & { index: number })[];
}
export const getGroupedFullUsersByRoles = <
  D extends FullDistrictLeader = FullDistrictLeader,
  E extends FullEngineer = FullEngineer,
  S extends FullStationWorker = FullStationWorker,
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

  rawUsers.forEach((user, index) => {
    if (user.role === USER_ROLES.DISTRICT_LEADER && user.districtId) {
      result.districtLeaders.push({ ...(user as D), index });
    }
    if (user.role === USER_ROLES.ENGINEER && user.districtId) {
      result.engineers.push({ ...(user as E), index });
    }
    if (user.role === USER_ROLES.STATION_WORKER && user.clientId) {
      result.stationWorkers.push({ ...(user as S), index });
    }
    result.simpleUsers.push({ ...(user as A), index });
  });

  return result;
};
