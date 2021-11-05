export type RequiredOne<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]: T[X];
} & {
  [P in K]-?: T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type NonNullableObject<T> = { [P in keyof T]: NonNullable<T[P]> };
