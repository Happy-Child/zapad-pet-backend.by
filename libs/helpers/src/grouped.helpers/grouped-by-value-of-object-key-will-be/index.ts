import { NonNullableObject } from '@app/types';
import { valueOfObjectKeyWillBe } from '@app/helpers/value-of-object-key-will-be.helpers/value-of-object-key-will-be';

type TGroupedByValueOfObjectKeyWillBeReturn<T> = {
  added: NonNullableObject<T>[];
  replaced: NonNullableObject<T>[];
  deleted: { [P in keyof T]: T[P] }[];
};

export const groupedByValueOfObjectKeyWillBe = <T extends { id: number }>(
  nextItems: T[],
  prevItems: Partial<T>[],
  field: keyof T,
  typeOfPrevValue = 'number',
): TGroupedByValueOfObjectKeyWillBeReturn<T> =>
  nextItems.reduce<TGroupedByValueOfObjectKeyWillBeReturn<T>>(
    (result, nextItem) => {
      const prevItem = prevItems.find(({ id }) => id === nextItem.id);

      if (!prevItem) return result;

      const { added, replaced, deleted } = valueOfObjectKeyWillBe(
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
