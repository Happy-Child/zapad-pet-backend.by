import { FileStorageEntity } from '@app/entities';

export type IRawFile = Express.Multer.File;

export interface IFileStorageStrategy {
  uploadFile: (rawFile: IRawFile) => Promise<FileStorageEntity>;
  deleteFile: (storageFileId: number) => Promise<true>;
}
