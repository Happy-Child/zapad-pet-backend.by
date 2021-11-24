import { Injectable } from '@nestjs/common';
import { StationStatisticDTO } from '../../stations/dtos/stations-getting.dtos';
import { RegionsGeneralService } from './regions-general.service';
import { RegionsRepository } from '../repositories';

@Injectable()
export class RegionsGettingService {
  constructor(
    private readonly regionsGeneralService: RegionsGeneralService,
    private readonly regionsRepository: RegionsRepository,
  ) {}

  public async getStatisticsById(id: number): Promise<StationStatisticDTO> {
    await this.regionsGeneralService.getRegionOrFail(id);
    return this.regionsRepository.getRegionStatisticById(id);
  }
}
