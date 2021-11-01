import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsWorkersRepository } from './repositories';
import { StationsWorkersGeneralService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([StationsWorkersRepository])],
  providers: [StationsWorkersGeneralService],
  exports: [StationsWorkersGeneralService],
})
export class StationsWorkersModule {}
