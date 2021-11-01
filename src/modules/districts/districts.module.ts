import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';
import { DistrictsGeneralCheckingService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
  providers: [DistrictsGeneralCheckingService],
  exports: [DistrictsGeneralCheckingService],
})
export class DistrictsModule {}
