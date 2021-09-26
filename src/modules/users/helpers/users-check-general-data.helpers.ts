import { ENTITIES_FIELDS } from '@app/entities';
import { FilteredUserForCheck } from '../types/users-general.types';

export const getPreparingUsersWithDubbedEmail = (
  users: { [ENTITIES_FIELDS.EMAIL]: string }[],
  existingUsers: { [ENTITIES_FIELDS.EMAIL]: string }[],
) =>
  existingUsers.map((existingUser) => {
    const index = users.findIndex(({ email }) => email === existingUser.email);
    return { ...existingUser, index };
  });

export const getPreparingUsersNotEmptyDistricts = (
  users: FilteredUserForCheck<{ [ENTITIES_FIELDS.DISTRICT_ID]: number }>[],
  emptyDistricts: { [ENTITIES_FIELDS.ID]: number }[],
) => {
  const emptyDistrictsIds = emptyDistricts.map(({ id }) => id);
  return users.filter(
    ({ districtId }) => !emptyDistrictsIds.includes(districtId),
  );
};
