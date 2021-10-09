import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictsRepository])],
})
export class DistrictsModule {}
