export const valueOfObjectKeyWillBeReplaced = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfFieldValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return (
    typeof prevValue === typeOfFieldValue &&
    typeof nextValue === typeOfFieldValue
  );
};
