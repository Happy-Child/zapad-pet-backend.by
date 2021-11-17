export const groupedByChangedFields = <T extends { id: number }>(
  itemsA: T[],
  itemsB: Partial<T>[],
  fields: (keyof T)[],
): Record<keyof T, T[]> => {
  const result = fields.reduce(
    (map, field) => ({ ...map, [field]: [] }),
    {},
  ) as Record<keyof T, T[]>;

  itemsA.forEach((itemA) => {
    const itemB = itemsB.find(({ id }) => itemA.id === id);

    if (!itemB) {
      return;
    }

    fields.forEach((field) => {
      const valueItemA = itemA[field];
      const valueItemB = itemB[field];
      if (valueItemA !== valueItemB) {
        if (field in result) {
          result[field].push(itemA);
        } else {
          result[field] = [itemA];
        }
      }
    });
  });

  return result;
};
