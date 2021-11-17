export const groupedByChangedFields = <T extends { id: number }>(
  newItems: T[],
  existingItems: Partial<T>[],
  fields: (keyof T)[],
): Record<keyof T, T[]> => {
  const result = fields.reduce(
    (map, field) => ({ ...map, [field]: [] }),
    {},
  ) as Record<keyof T, T[]>;

  newItems.forEach((newItem) => {
    const existingItem = existingItems.find(({ id }) => newItem.id === id);

    if (!existingItem) {
      return;
    }

    fields.forEach((field) => {
      const valueNewItem = newItem[field];
      const valueExistingItem = existingItem[field];

      if (valueNewItem !== valueExistingItem) {
        if (field in result) {
          result[field].push(newItem);
        } else {
          result[field] = [newItem];
        }
      }
    });
  });

  return result;
};
