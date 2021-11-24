export const valueToBool = <V = string>(value: V): V | boolean => {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(String(value).toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(String(value).toLowerCase())) {
    return false;
  }
  return value;
};
