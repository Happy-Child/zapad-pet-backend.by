import {
  Controller,
  Post,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IRawFile } from '@app/file-storage/interfaces';
import { FileStorageGeneralService } from '@app/file-storage/services';
import { UploadFileValidationPipe } from '@app/file-storage/pipes';

@Controller('file-storage')
export class FileStorageController {
  constructor(
    private readonly fileStorageGeneralService: FileStorageGeneralService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new UploadFileValidationPipe())
  @Post('/upload')
  async upload(@UploadedFile() file: IRawFile): Promise<number> {
    const { id } = await this.fileStorageGeneralService.uploadFile(file);
    return id;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/delete/:storageFileId')
  async delete(
    @Param('fileId', ParseIntPipe) storageFileId: number,
  ): Promise<true> {
    await this.fileStorageGeneralService.deleteFile(storageFileId);
    return true;
  }
}
