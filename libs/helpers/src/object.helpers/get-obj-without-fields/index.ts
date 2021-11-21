export const getObjWithoutFields = <T, R>(obj: T, fields: (keyof T)[]): R => {
  const localObj: T = JSON.parse(JSON.stringify(obj));
  fields.forEach((field) => {
    delete localObj[field];
  });
  return localObj as unknown as R;
};
