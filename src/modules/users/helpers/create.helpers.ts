import { USER_ROLES } from '@app/constants';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../interfaces/create.interfaces';
import { getFilteredGeneralUsers } from '@app/helpers';

interface GetFilteredUsersToCreate {
  districtLeaders: UsersCreateDistrictLeader[];
  engineers: UsersCreateEngineer[];
  stationWorkers: UsersCreateStationWorker[];
}
export const getFilteredUsersToCreate = (
  rawUsers: { role: USER_ROLES }[],
): GetFilteredUsersToCreate => {
  const { districtLeaders, engineers, stationWorkers } =
    getFilteredGeneralUsers(rawUsers);
  return {
    districtLeaders,
    engineers,
    stationWorkers,
  } as GetFilteredUsersToCreate;
};
