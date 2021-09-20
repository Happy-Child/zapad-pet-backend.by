import { ClientRepository, DistrictRepository } from '../repositories';
import { getItemsByUniqueField } from '@app/helpers/array.helpers';
import { USER_ROLES } from '@app/constants';
import {
  UserAccountant,
  UserDistrictLeader,
  UserEngineer,
  UserStationWorker,
} from '@app/interfaces/users/users-roles.interfaces';
import { UserClientMemberOrStationWorkerFields } from '@app/interfaces/users/users-general.interfaces';
import { AllowedRolesType } from '@app/types';

interface GetFilteredGeneralUsers {
  districtLeaders: UserDistrictLeader[];
  engineers: UserEngineer[];
  stationWorkers: UserStationWorker[];
  accountants: UserAccountant[];
}
export const getFilteredGeneralUsers = (
  rawUsers: { role: AllowedRolesType }[],
): GetFilteredGeneralUsers => {
  const result: GetFilteredGeneralUsers = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    accountants: [],
  };

  rawUsers.forEach((user) => {
    switch (user.role) {
      case USER_ROLES.ACCOUNTANT:
        result.accountants.push(user as UserAccountant);
        break;
      case USER_ROLES.DISTRICT_LEADER:
        result.districtLeaders.push(user as UserDistrictLeader);
        break;
      case USER_ROLES.ENGINEER:
        result.engineers.push(user as UserEngineer);
        break;
      case USER_ROLES.STATION_WORKER:
        result.stationWorkers.push(user as UserStationWorker);
        break;
    }
  });

  return result;
};

interface GetUsersWithNotExistsClientsOrDistrictsProps<
  T extends UserClientMemberOrStationWorkerFields,
> {
  fieldName: 'clientId' | 'districtId';
  users: T[];
  repository: ClientRepository | DistrictRepository;
}
export const getUsersWithNotExistsClientsOrDistricts = async <
  T extends UserClientMemberOrStationWorkerFields,
>({
  fieldName,
  users,
  repository,
}: GetUsersWithNotExistsClientsOrDistrictsProps<T>): Promise<T[]> => {
  const searchedClientsOrDistrictsIds =
    getItemsByUniqueField<UserClientMemberOrStationWorkerFields>(
      fieldName,
      users,
    );

  const existingClientsOrDistricts = await repository
    .createQueryBuilder('u')
    .where('u.id IN (:...ids)', { ids: searchedClientsOrDistrictsIds })
    .orderBy('u.id')
    .getMany();

  if (
    existingClientsOrDistricts.length === searchedClientsOrDistrictsIds.length // If all clients or districts exists
  )
    return [];

  const existingClientsOrDistrictsIds = existingClientsOrDistricts.map(
    ({ id }) => id,
  );

  const usersWithNotExistingClientsOrDistricts = users.filter((user) => {
    const clientOrDistrictId = user[fieldName] as number;
    const curClientOrDistrictIdExist =
      existingClientsOrDistrictsIds.includes(clientOrDistrictId);
    return !curClientOrDistrictIdExist;
  });

  return usersWithNotExistingClientsOrDistricts;
};
