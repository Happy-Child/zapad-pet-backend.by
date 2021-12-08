import { valueOfObjectKeyWillBeAdded } from '../value-of-object-key-will-be-added';
import { valueOfObjectKeyWillBeReplaced } from '../value-of-object-key-will-be-replaced';
import { valueOfObjectKeyWillBeDeleted } from '../value-of-object-key-will-be-deleted';

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
