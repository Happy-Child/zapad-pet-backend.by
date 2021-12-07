export type RequiredField<T, K extends keyof T> = Omit<T, K> &
  Pick<Required<T>, K>;

export type NonEmptyArray<T> = [T, ...T[]];

export type NonNullableObject<T> = { [P in keyof T]: NonNullable<T[P]> };
