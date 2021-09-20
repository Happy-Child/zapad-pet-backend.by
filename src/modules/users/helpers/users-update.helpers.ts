import {
  IUsersUpdateDistrictLeader,
  IUsersUpdateGeneralUser,
  IUsersUpdateUserEngineer,
} from '../interfaces';
import { getFilteredGeneralUsers } from './users-general.helpers';
import { ClientMembersRolesType } from '@app/user';

interface IGetFilteredUsersToUpdate {
  districtLeaders: IUsersUpdateDistrictLeader[];
  engineers: IUsersUpdateUserEngineer[];
  others: IUsersUpdateGeneralUser[];
}
interface RawUser {
  role?: ClientMembersRolesType;
}
export const getFilteredUsersToUpdate = (
  rawUsers: RawUser[],
): IGetFilteredUsersToUpdate => {
  const usersWithRoles: Required<RawUser>[] = [];
  const others: IUsersUpdateGeneralUser[] = [];

  rawUsers.forEach((user) => {
    if (user.role) usersWithRoles.push(user as Required<RawUser>);
    else others.push(user as IUsersUpdateGeneralUser);
  });

  const { districtLeaders, engineers } = getFilteredGeneralUsers(
    usersWithRoles as Required<RawUser>[],
  );

  return {
    districtLeaders,
    engineers,
    others,
  } as unknown as IGetFilteredUsersToUpdate;
};
