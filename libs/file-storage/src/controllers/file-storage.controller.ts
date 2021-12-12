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
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('file-storage')
@Controller('file-storage')
export class FileStorageController {
  constructor(
    private readonly fileStorageGeneralService: FileStorageGeneralService,
  ) {}

  @ApiOkResponse({ type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER, USER_ROLES.ENGINEER)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new UploadFileValidationPipe())
  @Post('/upload')
  async upload(@UploadedFile() file: IRawFile): Promise<number> {
    const { id } = await this.fileStorageGeneralService.uploadFile(file);
    return id;
  }

  // TODO impl
  // @ApiOkResponse({ type: Number })
  // @HttpCode(HttpStatus.OK)
  // @Post('/delete/:storageFileId')
  // async delete(
  //   @Param('fileId', ParseIntPipe) storageFileId: number,
  // ): Promise<true> {
  //   await this.fileStorageGeneralService.deleteFile(storageFileId);
  //   return true;
  // }
}
