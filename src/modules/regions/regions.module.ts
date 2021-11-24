import { Module } from '@nestjs/common';
import { RegionsGettingService, RegionsGeneralService } from './services';
import { RegionsController } from './controllers/regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([RegionsRepository])],
  providers: [RegionsGettingService, RegionsGeneralService],
  controllers: [RegionsController],
})
export class RegionsModule {}
