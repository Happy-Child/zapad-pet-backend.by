import { USER_ROLES } from '@app/constants';
import { getFilteredGeneralUsers } from '@app/helpers';
import {
  UsersUpdateDistrictLeader,
  UsersUpdateGeneralUser,
  UsersUpdateUserEngineer,
} from '../interfaces/update.interfaces';

interface GetFilteredUsersToUpdate {
  districtLeaders: UsersUpdateDistrictLeader[];
  engineers: UsersUpdateUserEngineer[];
  others: UsersUpdateGeneralUser[];
}
export const getFilteredUsersToUpdate = (
  rawUsers: { role: USER_ROLES }[],
): GetFilteredUsersToUpdate => {
  const { districtLeaders, engineers, stationWorkers, accountants } =
    getFilteredGeneralUsers(rawUsers);
  return {
    districtLeaders,
    engineers,
    others: [...stationWorkers, ...accountants],
  } as unknown as GetFilteredUsersToUpdate;
};
