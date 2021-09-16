import { ClientRepository } from '../repositories/client.repository';
import { DistrictRepository } from '../repositories/district.repository';
import { getArrayUniqueFieldsByFieldName } from '@app/helpers/array.helpers';
import {
  UserStationWorkerFields,
  UserEngineerFields,
  UserDistrictLeaderFields,
} from '@app/interfaces';

interface GetUsersWithNotExistsClientsOrDistrictsProps<
  T = UserStationWorkerFields | UserEngineerFields | UserDistrictLeaderFields,
> {
  fieldName: 'clientId' | 'districtId';
  users: T[];
  repository: ClientRepository | DistrictRepository;
}
export const getUsersWithNotExistsClientsOrDistricts = async <
  T = UserStationWorkerFields | UserEngineerFields | UserDistrictLeaderFields,
>({
  fieldName,
  users,
  repository,
}: GetUsersWithNotExistsClientsOrDistrictsProps<T>): Promise<T[]> => {
  const searchedClientsOrDistrictsIds = getArrayUniqueFieldsByFieldName<{
    clientId?: number;
    districtId?: number;
  }>(fieldName, users);

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
    const clientOrDistrictId = user[fieldName];
    const curClientOrDistrictIdExist =
      existingClientsOrDistrictsIds.includes(clientOrDistrictId);
    return !curClientOrDistrictIdExist;
  });

  return usersWithNotExistingClientsOrDistricts;
};
