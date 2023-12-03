import fs from 'fs';
import path from 'path';

export const readFile = (path: string): string => {
  return fs.readFileSync(path).toString();
};
export const saveFile = async (
  pathRelativeByProject: string,
  fileName: string,
  data: string | Uint8Array,
  options = null,
): Promise<void> => {
  await fs.promises.appendFile(
    `${path.resolve()}/${pathRelativeByProject}/${fileName}`,
    data,
    options,
  );
};

export const deleteFile = async (
  pathRelativeByProject: string,
  fileName: string,
): Promise<void> => {
  // TODO impl
};

export const getFileNameForSave = (rawFileName: string): string =>
  Date.now() + path.extname(rawFileName);
