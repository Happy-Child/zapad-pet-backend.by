import { Module } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';

@Module({
  providers: [PugGeneralService],
  exports: [PugGeneralService],
})
export class PugModule {}
