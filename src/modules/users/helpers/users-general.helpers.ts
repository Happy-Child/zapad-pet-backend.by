import {
  UsersClientsRepository,
  UsersDistrictsRepository,
} from '../repositories';
import { getItemsByUniqueField } from '@app/helpers/array.helpers';
import { ENTITIES_FIELDS } from '@app/entities';
import {
  IDistrictLeaderIdentifyingFields,
  IEngineerIdentifyingFields,
  IStationWorkerIdentifyingFields,
  IClientMemberOrStationWorkerIdentifyingFields,
} from '../interfaces';
import { AllowedRolesType } from '../types';
import { USER_ROLES } from '../constants';
import { FilteredUser } from '../types/users-general.types';

interface IRawFilteredUser {
  role: AllowedRolesType;
  clientId?: number;
  districtId?: number;
}

interface IGetFilteredGeneralUsers {
  districtLeaders: FilteredUser<IDistrictLeaderIdentifyingFields>[];
  engineers: FilteredUser<IEngineerIdentifyingFields>[];
  stationWorkers: FilteredUser<IStationWorkerIdentifyingFields>[];
  simples: FilteredUser<{ role: AllowedRolesType }>[];
}
export const getFilteredGeneralUsers = (
  rawUsers: IRawFilteredUser[],
): IGetFilteredGeneralUsers => {
  const result: IGetFilteredGeneralUsers = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    simples: [],
  };

  rawUsers.forEach((user, index) => {
    if (user.role === USER_ROLES.DISTRICT_LEADER && user.districtId) {
      result.districtLeaders.push({
        ...(user as IDistrictLeaderIdentifyingFields),
        index,
      });
      return;
    }
    if (user.role === USER_ROLES.ENGINEER && user.districtId) {
      result.engineers.push({ ...(user as IEngineerIdentifyingFields), index });
      return;
    }
    if (user.role === USER_ROLES.STATION_WORKER && user.clientId) {
      result.stationWorkers.push({
        ...(user as IStationWorkerIdentifyingFields),
        index,
      });
      return;
    }
    result.simples.push({ ...user, index });
  });

  return result;
};

interface IGetUsersWithNotExistsClientsOrDistrictsProps<
  T extends IClientMemberOrStationWorkerIdentifyingFields,
> {
  users: T[];
  fieldName: ENTITIES_FIELDS.CLIENT_ID | ENTITIES_FIELDS.DISTRICT_ID;
  repository: UsersClientsRepository | UsersDistrictsRepository;
}
export const getUsersWithNotExistsClientsOrDistricts = async <
  T extends IClientMemberOrStationWorkerIdentifyingFields,
>({
  fieldName,
  users,
  repository,
}: IGetUsersWithNotExistsClientsOrDistrictsProps<T>): Promise<T[]> => {
  const searchedClientsOrDistrictsIds =
    getItemsByUniqueField<IClientMemberOrStationWorkerIdentifyingFields>(
      fieldName,
      users,
    );

  const existingClientsOrDistricts = await repository
    .createQueryBuilder('u')
    .where('u.id IN (:...ids)', { ids: searchedClientsOrDistrictsIds })
    .orderBy('u.id')
    .getMany();

  if (
    existingClientsOrDistricts.length === searchedClientsOrDistrictsIds.length
  )
    return [];

  const existingClientsOrDistrictsIds = existingClientsOrDistricts.map(
    ({ id }) => id,
  );

  const usersWithNotExistingClientsOrDistricts = users.filter((user) => {
    const clientOrDistrictId = user[fieldName] as number;
    const clientOrDistrictExist =
      existingClientsOrDistrictsIds.includes(clientOrDistrictId);
    return !clientOrDistrictExist;
  });

  return usersWithNotExistingClientsOrDistricts;
};
