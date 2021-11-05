export const strToBoolean = (val: string): boolean | null => {
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
};
