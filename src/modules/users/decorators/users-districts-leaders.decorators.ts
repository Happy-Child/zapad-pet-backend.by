import { ValidateBy, ARRAY_UNIQUE } from 'class-validator';
import { USER_ROLES, USERS_ERRORS } from '../constants';
import { getUniquePrimitiveArray } from '@app/helpers';
import { getGroupedUsersByRoles } from '../helpers';
import { AllowedRolesType } from '../types';

const identifier = <T extends { role: AllowedRolesType; districtId?: number }>(
  items: T[] | undefined,
): boolean => {
  if (!items || !Array.isArray(items)) return false;

  const { districtLeaders } = getGroupedUsersByRoles<{
    districtId: number;
    role: USER_ROLES.DISTRICT_LEADER;
  }>(items);

  if (!districtLeaders.length) return true;

  const groupedFields = districtLeaders.map(
    ({ role, districtId }) => `${role}-${districtId}`,
  );
  const uniqueGroupedFields = getUniquePrimitiveArray(groupedFields);

  return groupedFields.length === uniqueGroupedFields.length;
};

export function UniqueDistrictLeadersInArray<
  T extends { role: AllowedRolesType; districtId?: number },
>() {
  return ValidateBy({
    name: ARRAY_UNIQUE,
    validator: {
      validate: (value: T[]): boolean => identifier(value),
      defaultMessage: () =>
        USERS_ERRORS.DISTRICT_LEADERS_SHOULD_HAVE_UNIQUE_DISTRICT_ID,
    },
  });
}
