import { ValidateBy, ARRAY_UNIQUE } from 'class-validator';
import { USERS_ERRORS } from '../constants';
import { getFilteredGeneralUsers } from '../helpers';
import { getUniquePrimitiveArray } from '@app/helpers';
import { IClientMemberOrStationWorkerIdentifyingFields } from '../interfaces';

const uniqueArrayOfDistrictLeadersIdentifier = <
  T extends IClientMemberOrStationWorkerIdentifyingFields,
>(
  items: T[] | undefined,
): boolean => {
  if (!items) return false;

  const { districtLeaders } = getFilteredGeneralUsers(items);

  if (!districtLeaders.length) return true;

  const groupedFields = districtLeaders.map(
    ({ role, districtId }) => `${role}-${districtId}`,
  );
  const uniqueGroupedFields = getUniquePrimitiveArray(groupedFields);

  return groupedFields.length === uniqueGroupedFields.length;
};

export function UniqueArrayOfDistrictLeaders<
  T extends IClientMemberOrStationWorkerIdentifyingFields,
>() {
  return ValidateBy({
    name: ARRAY_UNIQUE,
    validator: {
      validate: (value: T[]): boolean =>
        uniqueArrayOfDistrictLeadersIdentifier(value),
      defaultMessage: () =>
        USERS_ERRORS.DISTRICT_LEADERS_SHOULD_HAVE_UNIQUE_DISTRICT_ID,
    },
  });
}
