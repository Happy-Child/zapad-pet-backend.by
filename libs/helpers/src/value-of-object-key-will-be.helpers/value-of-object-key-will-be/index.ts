import {
  valueOfObjectKeyWillBeAdded,
  valueOfObjectKeyWillBeDeleted,
  valueOfObjectKeyWillBeReplaced,
} from '@app/helpers';

export const valueOfObjectKeyWillBe = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfFieldValue = 'number',
): { added: boolean; replaced: boolean; deleted: boolean } => ({
  added: valueOfObjectKeyWillBeAdded(next, prev, field, typeOfFieldValue),
  replaced: valueOfObjectKeyWillBeReplaced(next, prev, field, typeOfFieldValue),
  deleted: valueOfObjectKeyWillBeDeleted(next, prev, field, typeOfFieldValue),
});
