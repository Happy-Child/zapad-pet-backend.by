import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsLeadersRepository } from './repositories';
import { DistrictsLeadersGeneralService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsLeadersRepository])],
  providers: [DistrictsLeadersGeneralService],
  exports: [DistrictsLeadersGeneralService],
})
export class DistrictsLeadersModule {}
