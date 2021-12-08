import path from 'path';
import { FILE_STORAGE } from 'config';

export enum FILE_STORAGE_STRATEGY {
  LOCAL = 'LOCAL',
  DROPBOX = 'DROPBOX',
}

export const DEFAULT_FILE_STORAGE_STRATEGY = FILE_STORAGE_STRATEGY.LOCAL;

export const FILE_STORAGE_PROVIDER_KEY = 'FILE_STORAGE_PROVIDER_KEY';

export const BYTES_SIZES = {
  MD: 1000000,
};

export const DEFAULT_UPLOAD_FILE_SIZE = BYTES_SIZES.MD * 2;

export enum FILE_EXT {
  JPG = '.jpg',
  PNG = '.png',
}

export const DEFAULT_UPLOAD_FILE_EXTS = [FILE_EXT.PNG, FILE_EXT.JPG];

export const PATH_TO_LOCAL_STORAGE = `${path.resolve()}/${
  FILE_STORAGE.LOCAL_STORAGE_PATH
}`;
