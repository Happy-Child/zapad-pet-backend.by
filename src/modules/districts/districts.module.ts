import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';
import {
  DistrictsChangeEngineersService,
  DistrictsChangeLeadersService,
  DistrictsGeneralService,
  DistrictsGettingService,
} from './services';
import { DistrictsController } from './controllers/districts.controller';
import { EntityFinderModule } from '../entity-finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictsRepository]),
    EntityFinderModule,
  ],
  providers: [
    DistrictsGeneralService,
    DistrictsGettingService,
    DistrictsChangeLeadersService,
    DistrictsChangeEngineersService,
  ],
  controllers: [DistrictsController],
  exports: [DistrictsGeneralService],
})
export class DistrictsModule {}
