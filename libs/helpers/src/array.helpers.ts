export const getUniquePrimitiveArray = <T = string | number>(arr: T[]): T[] =>
  Array.from(new Set(arr));

export const getItemsByUniqueField = <T>(
  fieldName: keyof T,
  array: T[],
): Required<T>[keyof T][] => {
  let arr = array.map((item) => item[fieldName]);
  arr = arr.filter((a) => a);
  arr = getUniquePrimitiveArray(arr);
  return arr;
};

export const toObjectByField = <T>(
  field: keyof T,
  arr: T[],
): Record<string, T> =>
  arr.reduce((map, item) => ({ ...map, [String(item[field])]: item }), {});
