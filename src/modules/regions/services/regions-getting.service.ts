import { Injectable } from '@nestjs/common';
import { StationStatisticDTO } from '../../stations/dtos/stations-getting.dtos';
import { RegionsGeneralService } from './regions-general.service';
import { RegionsRepository } from '../repositories';
import { RegionsGetAllResponseBodyDTO } from '../dtos';

@Injectable()
export class RegionsGettingService {
  constructor(
    private readonly regionsGeneralService: RegionsGeneralService,
    private readonly regionsRepository: RegionsRepository,
  ) {}

  public async getAll(): Promise<RegionsGetAllResponseBodyDTO> {
    return this.regionsRepository.getAll();
  }

  public async getStatisticsById(id: number): Promise<StationStatisticDTO> {
    await this.regionsGeneralService.getRegionOrFail(id);
    return this.regionsRepository.getRegionStatisticById(id);
  }
}
