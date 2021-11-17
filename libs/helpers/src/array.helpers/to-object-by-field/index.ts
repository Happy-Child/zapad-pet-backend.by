export const toObjectByField = <T>(
  field: keyof T,
  arr: T[],
): Record<string, T> =>
  arr.reduce((map, item) => ({ ...map, [String(item[field])]: item }), {});
