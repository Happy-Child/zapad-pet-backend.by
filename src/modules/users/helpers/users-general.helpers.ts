import { ClientRepository, DistrictRepository } from '../repositories';
import { getItemsByUniqueField } from '@app/helpers/array.helpers';
import {
  AllowedRolesType,
  IUserAccountant,
  IUserClientMemberOrStationWorkerFields,
  IUserDistrictLeader,
  IUserEngineer,
  IUserStationWorker,
  USER_ROLES,
} from '@app/user';
import { ENTITIES_FIELDS } from '@app/entities';

interface IGetFilteredGeneralUsers {
  districtLeaders: IUserDistrictLeader[];
  engineers: IUserEngineer[];
  stationWorkers: IUserStationWorker[];
  accountants: IUserAccountant[];
}
export const getFilteredGeneralUsers = (
  rawUsers: { role: AllowedRolesType }[],
): IGetFilteredGeneralUsers => {
  const result: IGetFilteredGeneralUsers = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    accountants: [],
  };

  rawUsers.forEach((user) => {
    switch (user.role) {
      case USER_ROLES.ACCOUNTANT:
        result.accountants.push(user as IUserAccountant);
        break;
      case USER_ROLES.DISTRICT_LEADER:
        result.districtLeaders.push(user as IUserDistrictLeader);
        break;
      case USER_ROLES.ENGINEER:
        result.engineers.push(user as IUserEngineer);
        break;
      case USER_ROLES.STATION_WORKER:
        result.stationWorkers.push(user as IUserStationWorker);
        break;
    }
  });

  return result;
};

interface IGetUsersWithNotExistsClientsOrDistrictsProps<
  T extends IUserClientMemberOrStationWorkerFields,
> {
  fieldName: ENTITIES_FIELDS.CLIENT_ID | ENTITIES_FIELDS.DISTRICT_ID;
  users: T[];
  repository: ClientRepository | DistrictRepository;
}
export const getUsersWithNotExistsClientsOrDistricts = async <
  T extends IUserClientMemberOrStationWorkerFields,
>({
  fieldName,
  users,
  repository,
}: IGetUsersWithNotExistsClientsOrDistrictsProps<T>): Promise<T[]> => {
  const searchedClientsOrDistrictsIds =
    getItemsByUniqueField<IUserClientMemberOrStationWorkerFields>(
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
