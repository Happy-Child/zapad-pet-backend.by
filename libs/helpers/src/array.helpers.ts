export const getArrayUniqueFieldsByFieldName = <T>(
  fieldName: keyof T,
  array: T[],
): Required<T>[keyof T][] => {
  let arr = array.map((item) => item[fieldName]);
  arr = arr.filter((a) => a);
  arr = Array.from(new Set(arr));
  return arr;
};
