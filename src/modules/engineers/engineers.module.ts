import { Module } from '@nestjs/common';
import {
  EngineersCheckBeforeUpdateService,
  EngineersCheckBeforeCreateService,
} from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineersRepository } from './repositories';
import { EntityFinderModule } from '../entity-finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([EngineersRepository]),
    EntityFinderModule,
  ],
  providers: [
    EngineersCheckBeforeUpdateService,
    EngineersCheckBeforeCreateService,
  ],
  exports: [
    EngineersCheckBeforeUpdateService,
    EngineersCheckBeforeCreateService,
  ],
})
export class EngineersModule {}
