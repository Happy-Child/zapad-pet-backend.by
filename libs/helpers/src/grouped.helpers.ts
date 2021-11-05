import { isNull } from '@app/helpers/types-checking.helpers';
import {
  nextItemWillAddedValue,
  nextItemWillDeletedValue,
  nextItemWillReplacedValue,
} from '@app/helpers/checking.helpers';
import { NonNullableObject } from '@app/types';

export const getGroupedByConditions = <T>(
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
  ...getGroupedByConditions<T>(arr, [(item) => !isNull(item[field])]),
  ...getGroupedByConditions<T>(arr, [(item) => isNull(item[field])]),
];

export const groupedByChangedFields = <T extends { id: number }>(
  itemsA: T[],
  itemsB: Partial<T>[],
  fields: (keyof T)[],
): Record<keyof T, T[]> => {
  const result = fields.reduce(
    (map, field) => ({ ...map, [field]: [] }),
    {},
  ) as Record<keyof T, T[]>;

  itemsA.forEach((itemA) => {
    const itemB = itemsB.find(({ id }) => itemA.id === id);

    if (!itemB) {
      return;
    }

    fields.forEach((field) => {
      const valueItemA = itemA[field];
      const valueItemB = itemB[field];
      if (valueItemA !== valueItemB) {
        if (field in result) {
          result[field].push(itemA);
        } else {
          result[field] = [itemA];
        }
      }
    });
  });

  return result;
};

export const nextItemValueWillBe = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfPrevValue = 'number',
): { added: boolean; replaced: boolean; deleted: boolean } => ({
  added: nextItemWillAddedValue(next, prev, field, typeOfPrevValue),
  replaced: nextItemWillReplacedValue(next, prev, field, typeOfPrevValue),
  deleted: nextItemWillDeletedValue(next, prev, field, typeOfPrevValue),
});

type TGroupedByNextStateValuesReturn<T> = {
  added: NonNullableObject<T>[];
  replaced: NonNullableObject<T>[];
  deleted: { [P in keyof T]: T[P] }[];
};
export const groupedByNextStateValues = <T extends { id: number }>(
  nextItems: T[],
  prevItems: Partial<T>[],
  field: keyof T,
  typeOfPrevValue = 'number',
): TGroupedByNextStateValuesReturn<T> =>
  nextItems.reduce<TGroupedByNextStateValuesReturn<T>>(
    (result, nextItem) => {
      const prevItem = prevItems.find(({ id }) => id === nextItem.id);

      if (!prevItem) return result;

      const { added, replaced, deleted } = nextItemValueWillBe(
        nextItem,
        prevItem,
        field,
        typeOfPrevValue,
      );

      if (added) result.added.push(nextItem as NonNullableObject<T>);
      else if (replaced) result.replaced.push(nextItem as NonNullableObject<T>);
      else if (deleted) result.deleted.push(nextItem);

      return result;
    },
    {
      added: [],
      replaced: [],
      deleted: [],
    },
  );
