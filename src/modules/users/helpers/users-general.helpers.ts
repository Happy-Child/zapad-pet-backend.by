import {
  UsersClientsRepository,
  UsersDistrictsRepository,
} from '../repositories';
import { getItemsByUniqueField } from '@app/helpers/array.helpers';
import { ENTITIES_FIELDS } from '@app/entities';
import {
  IAccountantIdentifyingFields,
  IDistrictLeaderIdentifyingFields,
  IEngineerIdentifyingFields,
  IStationWorkerIdentifyingFields,
  IClientMemberOrStationWorkerIdentifyingFields,
} from '../interfaces';
import { AllowedRolesType } from '../types';
import { USER_ROLES } from '../constants';

interface IFilteredUser {
  role: AllowedRolesType;
  clientId?: number;
  districtId?: number;
}

interface IGetFilteredGeneralUsers {
  districtLeaders: IDistrictLeaderIdentifyingFields[];
  engineers: IEngineerIdentifyingFields[];
  stationWorkers: IStationWorkerIdentifyingFields[];
  accountants: IAccountantIdentifyingFields[];
}
export const getFilteredGeneralUsers = (
  rawUsers: IFilteredUser[],
): IGetFilteredGeneralUsers => {
  const result: IGetFilteredGeneralUsers = {
    districtLeaders: [],
    engineers: [],
    stationWorkers: [],
    accountants: [],
  };

  rawUsers.forEach((user) => {
    if (user.role === USER_ROLES.ACCOUNTANT) {
      result.accountants.push(user as IAccountantIdentifyingFields);
      return;
    }
    if (user.role === USER_ROLES.DISTRICT_LEADER && user.districtId) {
      result.districtLeaders.push(user as IDistrictLeaderIdentifyingFields);
      return;
    }
    if (user.role === USER_ROLES.ENGINEER && user.districtId) {
      result.engineers.push(user as IEngineerIdentifyingFields);
      return;
    }
    if (user.role === USER_ROLES.STATION_WORKER && user.clientId) {
      result.stationWorkers.push(user as IStationWorkerIdentifyingFields);
    }
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
    const curClientOrDistrictIdExist =
      existingClientsOrDistrictsIds.includes(clientOrDistrictId);
    return !curClientOrDistrictIdExist;
  });

  return usersWithNotExistingClientsOrDistricts;
};
