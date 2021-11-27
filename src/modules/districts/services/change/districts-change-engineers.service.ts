import { Injectable } from '@nestjs/common';
import { DistrictsGeneralService } from '../general';

@Injectable()
export class DistrictsChangeEngineersService {
  constructor(
    private readonly districtsGeneralService: DistrictsGeneralService,
  ) {}

  public async addEngineers(
    districtId: number,
    engineersIds: number[],
  ): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
  }

  public async removeEngineers(
    districtId: number,
    engineersIds: number[],
  ): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
  }
}
