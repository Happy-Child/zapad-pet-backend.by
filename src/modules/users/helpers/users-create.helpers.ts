import {
  IUsersCreateDistrictLeader,
  IUsersCreateStationWorker,
  IUsersCreateEngineer,
} from '../interfaces';
import { getFilteredGeneralUsers } from './users-general.helpers';
import { ClientMembersOrStationWorkerRolesType } from '@app/user';

interface IGetFilteredUsersToCreate {
  districtLeaders: IUsersCreateDistrictLeader[];
  engineers: IUsersCreateEngineer[];
  stationWorkers: IUsersCreateStationWorker[];
}
export const getFilteredUsersToCreate = (
  rawUsers: { role: ClientMembersOrStationWorkerRolesType }[],
): IGetFilteredUsersToCreate => {
  const { districtLeaders, engineers, stationWorkers } =
    getFilteredGeneralUsers(rawUsers);

  return {
    districtLeaders,
    engineers,
    stationWorkers,
  } as IGetFilteredUsersToCreate;
};
