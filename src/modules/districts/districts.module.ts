import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DistrictsRepository,
  DistrictsToEngineersRepository,
} from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DistrictsToEngineersRepository,
      DistrictsRepository,
    ]),
  ],
  providers: [DistrictsToEngineersRepository, DistrictsRepository],
  exports: [DistrictsToEngineersRepository, DistrictsRepository],
})
export class DistrictsModule {}
