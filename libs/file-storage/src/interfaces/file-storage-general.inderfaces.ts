export type IRawFile = Express.Multer.File;

export interface IFileStorageStrategy {
  uploadFile: (rawFile: IRawFile) => Promise<any>;
}
