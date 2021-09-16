import * as fs from 'fs';

export const readFile = (path: fs.PathOrFileDescriptor): string => {
  return fs.readFileSync(path).toString();
};
