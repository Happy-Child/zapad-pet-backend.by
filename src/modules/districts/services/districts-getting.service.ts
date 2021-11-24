import { Injectable } from '@nestjs/common';
import { DistrictStatisticDTO } from '../dtos/districts-getting.dtos';
import { DistrictsRepository } from '../repositories';
import { DistrictsGeneralService } from './general';

@Injectable()
export class DistrictsGettingService {
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly districtsGeneralService: DistrictsGeneralService,
  ) {}

  public async getStatisticsById(id: number): Promise<DistrictStatisticDTO> {
    await this.districtsGeneralService.getDistrictOrFail(id);
    return this.districtsRepository.getDistrictStatisticById(id);
  }
}
