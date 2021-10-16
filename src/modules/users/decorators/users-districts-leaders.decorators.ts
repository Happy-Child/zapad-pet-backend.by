import { ValidateBy, ARRAY_UNIQUE } from 'class-validator';
import { USER_ROLES, USERS_ERRORS } from '../constants';
import { getUniquePrimitiveArray } from '@app/helpers';
import { getGroupedFullUsersByRoles } from '../helpers';
import { AllowedRoles } from '../types';
import { NonEmptyArray } from '@app/types';

const identifier = <T extends { role: AllowedRoles; districtId?: number }>(
  items: T[] | undefined,
): boolean => {
  if (!items || !Array.isArray(items)) return false;

  const { districtLeaders } = getGroupedFullUsersByRoles<{
    districtId: number;
    role: USER_ROLES.DISTRICT_LEADER;
  }>(items);

  if (!districtLeaders.length) return true;

  const groupedFields = districtLeaders.map(
    ({ role, districtId }) => `${role}-${districtId}`,
  ) as NonEmptyArray<string>;
  const uniqueGroupedFields = getUniquePrimitiveArray(groupedFields);

  return groupedFields.length === uniqueGroupedFields.length;
};

export function UniqueDistrictLeadersInArray<
  T extends { role: AllowedRoles; districtId?: number },
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
