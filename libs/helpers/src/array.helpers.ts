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

type GetGroupedItemsByFieldReturn<T> = Record<
  string,
  Array<T & { index: number }>
>;
export const getGroupedItemsByField = <T>(
  fieldName: keyof T,
  array: T[],
): GetGroupedItemsByFieldReturn<T> => {
  let groupedItems: GetGroupedItemsByFieldReturn<T> = {};

  array.forEach((item, index) => {
    const value = String(item[fieldName]);
    const valueIsExists = value in groupedItems;

    if (valueIsExists) {
      groupedItems[value].push({ ...item, index });
    } else {
      groupedItems[value] = [{ ...item, index }];
    }
  });

  groupedItems = Object.keys(groupedItems).reduce((obj, key) => {
    const items = groupedItems[key];
    if (items.length > 1) {
      return { ...obj, [key]: items };
    }
    return obj;
  }, {});

  return groupedItems;
};

export const getItemsDubbedField = <T>(fieldName: keyof T, array: T[]): T[] => {
  const existingItems: T[] = [];
  const itemsDubbedField: T[] = [];

  array.forEach((item) => {
    const fieldValue = item[fieldName];

    const existingItem = existingItems.find(
      (itemsX) => itemsX[fieldName] === fieldValue,
    );

    if (existingItem) {
      itemsDubbedField.push(existingItem);
    } else {
      existingItems.push(item);
    }
  });

  return itemsDubbedField;
};

export const groupedBy = <T>(field: keyof T, arr: T[]): Record<string, T> =>
  arr.reduce((map, item) => ({ ...map, [String(item[field])]: item }), {});
