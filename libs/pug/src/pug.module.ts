import { Module } from '@nestjs/common';
import { PugService } from './pug.service';

@Module({
  providers: [PugService],
  exports: [PugService],
})
export class PugModule {}
