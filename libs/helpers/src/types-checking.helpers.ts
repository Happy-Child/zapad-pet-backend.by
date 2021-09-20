export const isUndefined = (value: any): boolean =>
  typeof value === 'undefined';

export const isNull = (value: any): boolean => value === null;

export const isObject = (value: any): boolean => typeof value === 'object';
