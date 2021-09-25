import {
  IUsersCreateDistrictLeader,
  IUsersCreateStationWorker,
  IUsersCreateEngineer,
  IUsersCreateSimpleUser,
} from '../interfaces';
import { getFilteredGeneralUsers } from './users-general.helpers';
import { UsersCreateItemDTO } from '../dtos';

interface IGetFilteredUsersToCreate {
  districtLeaders: IUsersCreateDistrictLeader[];
  engineers: IUsersCreateEngineer[];
  stationWorkers: IUsersCreateStationWorker[];
  simples: IUsersCreateSimpleUser[];
}
export const getFilteredUsersToCreate = (
  rawUsers: UsersCreateItemDTO[],
): IGetFilteredUsersToCreate => {
  const { districtLeaders, engineers, stationWorkers, simples } =
    getFilteredGeneralUsers(rawUsers);

  return {
    districtLeaders,
    engineers,
    stationWorkers,
    simples,
  } as IGetFilteredUsersToCreate;
};
