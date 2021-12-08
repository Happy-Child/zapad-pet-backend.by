import { DropboxStorageEntity, LocalStorageEntity } from '@app/entities';
import { PATH_TO_LOCAL_STORAGE } from '@app/file-storage/constants';
import { StorageFileDTO } from '@app/dtos';

export const getStorageFile = (
  localFile: LocalStorageEntity | null | undefined,
  dropboxFile: DropboxStorageEntity | null | undefined,
): StorageFileDTO | null => {
  if (localFile) {
    return {
      id: localFile.id,
      url: `${PATH_TO_LOCAL_STORAGE}/${localFile.filename}`,
    };
  } else if (dropboxFile) {
    // TODO impl
    return null;
  }

  return null;
};
