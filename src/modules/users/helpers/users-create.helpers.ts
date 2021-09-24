import {
  IUsersCreateDistrictLeader,
  IUsersCreateStationWorker,
  IUsersCreateEngineer,
} from '../interfaces';
import { getFilteredGeneralUsers } from './users-general.helpers';
import { UsersCreateItemDTO } from '../dtos';

interface IGetFilteredUsersToCreate {
  districtLeaders: IUsersCreateDistrictLeader[];
  engineers: IUsersCreateEngineer[];
  stationWorkers: IUsersCreateStationWorker[];
}
export const getFilteredUsersToCreate = (
  rawUsers: UsersCreateItemDTO[],
): IGetFilteredUsersToCreate => {
  const { districtLeaders, engineers, stationWorkers } =
    getFilteredGeneralUsers(rawUsers);

  return {
    districtLeaders,
    engineers,
    stationWorkers,
  } as IGetFilteredUsersToCreate;
};
