import { ENTITIES_FIELDS } from '@app/entities';

export const getPreparingUsersWithDubbedEmail = (
  users: { email: string }[],
  existingUsers: { [ENTITIES_FIELDS.EMAIL]: string }[],
) =>
  existingUsers.map((existingUser) => {
    const index = users.findIndex(({ email }) => email === existingUser.email);
    return { ...existingUser, index };
  });

export const getPreparingUsersNotEmptyDistricts = <
  T extends { districtId: number },
>(
  users: T[],
  emptyDistricts: { [ENTITIES_FIELDS.ID]: number }[],
) => {
  const emptyDistrictsIds = emptyDistricts.map(({ id }) => id);
  return users.filter(
    ({ districtId }) => !emptyDistrictsIds.includes(districtId),
  );
};
