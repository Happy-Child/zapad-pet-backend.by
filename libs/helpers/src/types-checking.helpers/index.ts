export const isUndefined = (value: any): value is undefined =>
  typeof value === 'undefined';

export const isNull = (value: any): value is null => value === null;

export const isObject = (value: any): value is Object =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;
