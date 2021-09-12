import { ClientRepository } from '../repositories/client.repository';
import { DistrictRepository } from '../repositories/district.repository';
import { getUniqueFieldsArrayByFieldName } from '@app/helpers/array.helpers';
import { UsersCreateDataDTO } from '../dtos/users-create.dtos';

interface CheckStationWorkersOrClientMembersOrFailProps {
  fieldName: 'clientId' | 'districtId';
  users: UsersCreateDataDTO[];
  repository: ClientRepository | DistrictRepository;
}
export const checkStationWorkersOrClientMembers = async ({
  fieldName,
  users,
  repository,
}: CheckStationWorkersOrClientMembersOrFailProps): Promise<
  void | (string | number)[]
> => {
  const searchedEntitiesIds =
    getUniqueFieldsArrayByFieldName<UsersCreateDataDTO>(fieldName, users);

  const existingEntities = await repository
    .createQueryBuilder('u')
    .where('u.id IN (:...ids)', { ids: searchedEntitiesIds })
    .orderBy('u.id')
    .getMany();

  if (existingEntities.length === searchedEntitiesIds.length) return;

  const existingEntitiesIds = existingEntities.map(({ id }) => id);

  const usersWithNotExistingEntities = users.filter(
    (user) => !existingEntitiesIds.includes(user[fieldName]),
  );

  return getUniqueFieldsArrayByFieldName<UsersCreateDataDTO>(
    fieldName,
    usersWithNotExistingEntities,
  );
};
