import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsLeadersRepository } from './repositories';
import {
  DistrictsLeadersGeneralService,
  DistrictsLeadersCheckBeforeUpdateService,
  DistrictsLeadersCheckBeforeCreateService,
} from './services';
import { EntityFinderModule } from '../entity-finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([DistrictsLeadersRepository]),
    EntityFinderModule,
  ],
  providers: [
    DistrictsLeadersGeneralService,
    DistrictsLeadersCheckBeforeCreateService,
    DistrictsLeadersCheckBeforeUpdateService,
  ],
  exports: [
    DistrictsLeadersGeneralService,
    DistrictsLeadersCheckBeforeCreateService,
    DistrictsLeadersCheckBeforeUpdateService,
  ],
})
export class DistrictsLeadersModule {}
