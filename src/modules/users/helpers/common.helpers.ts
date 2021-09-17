import { ClientRepository } from '../repositories/client.repository';
import { DistrictRepository } from '../repositories/district.repository';
import { getArrayUniqueFieldsByFieldName } from '@app/helpers/array.helpers';
import { UserClientMemberOrStationWorkerFields } from '@app/interfaces';

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
    getArrayUniqueFieldsByFieldName<UserClientMemberOrStationWorkerFields>(
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
