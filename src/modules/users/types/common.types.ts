import { USER_ROLES } from '@app/constants';
import {
  UserDistrictLeader,
  UserEngineer,
  UserStationWorker,
} from '../interfaces/create.interfaces';

export type GetUserRoleType<T extends USER_ROLES> =
  T extends USER_ROLES.STATION_WORKER
    ? UserStationWorker
    : T extends USER_ROLES.DISTRICT_LEADER
    ? UserDistrictLeader
    : T extends USER_ROLES.ENGINEER
    ? UserEngineer
    : void;
