export const getUniqueFieldsArrayByFieldName = <T>(
  fieldName: keyof T,
  array: T[],
): T[keyof T][] => {
  let arr = array.map((item) => item[fieldName]);
  arr = Array.from(new Set(arr));
  return arr;
};
