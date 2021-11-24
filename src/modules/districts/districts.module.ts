import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';
import { DistrictsGeneralService } from './services';
import { DistrictsGettingService } from './services/districts-getting.service';
import { DistrictsController } from './controllers/districts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
  providers: [DistrictsGeneralService, DistrictsGettingService],
  controllers: [DistrictsController],
  exports: [DistrictsGeneralService],
})
export class DistrictsModule {}
