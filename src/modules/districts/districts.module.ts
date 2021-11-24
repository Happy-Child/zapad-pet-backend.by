import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';
import { DistrictsGeneralService, DistrictsGettingService } from './services';
import { DistrictsController } from './controllers/districts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
  providers: [DistrictsGeneralService, DistrictsGettingService],
  controllers: [DistrictsController],
  exports: [DistrictsGeneralService],
})
export class DistrictsModule {}
