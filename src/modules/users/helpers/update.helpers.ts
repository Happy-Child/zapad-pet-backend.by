import { getFilteredGeneralUsers } from '@app/helpers';
import {
  UsersUpdateDistrictLeader,
  UsersUpdateGeneralUser,
  UsersUpdateUserEngineer,
} from '../interfaces/update.interfaces';
import { UsersUpdateRolesType } from '../types/update.types';

interface GetFilteredUsersToUpdate {
  districtLeaders: UsersUpdateDistrictLeader[];
  engineers: UsersUpdateUserEngineer[];
  others: UsersUpdateGeneralUser[];
}
interface RawUser {
  role?: UsersUpdateRolesType;
}
export const getFilteredUsersToUpdate = (
  rawUsers: RawUser[],
): GetFilteredUsersToUpdate => {
  const usersWithRoles: Required<RawUser>[] = [];
  const others: UsersUpdateGeneralUser[] = [];

  rawUsers.forEach((user) => {
    if (user.role) usersWithRoles.push(user as Required<RawUser>);
    else others.push(user as UsersUpdateGeneralUser);
  });

  const { districtLeaders, engineers } = getFilteredGeneralUsers(
    usersWithRoles as Required<RawUser>[],
  );

  return {
    districtLeaders,
    engineers,
    others,
  } as unknown as GetFilteredUsersToUpdate;
};
