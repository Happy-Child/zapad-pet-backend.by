import { isNull } from '@app/helpers';

export const groupedByConditions = <T>(
  arr: T[],
  conditions: ((item: T) => boolean)[],
): T[][] => {
  return conditions.reduce<T[][]>((result, condition) => {
    const items = arr.filter(condition);
    result.push(items);
    return result;
  }, []);
};

export const groupedByNull = <T>(arr: T[], field: keyof T): T[][] => [
  ...groupedByConditions<T>(arr, [(item) => !isNull(item[field])]),
  ...groupedByConditions<T>(arr, [(item) => isNull(item[field])]),
];
