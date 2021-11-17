import { NonEmptyArray } from '@app/types';

export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0;
