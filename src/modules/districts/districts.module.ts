import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';
import { DistrictsGeneralService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
  providers: [DistrictsGeneralService],
  exports: [DistrictsGeneralService],
})
export class DistrictsModule {}
