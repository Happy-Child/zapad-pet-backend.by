import { Injectable } from '@nestjs/common';
import {
  DistrictsGetAllResponseBodyDTO,
  DistrictStatisticDTO,
  DistrictWithStatisticsDTO,
} from '../dtos/districts-getting.dtos';
import { DistrictsRepository } from '../repositories';
import { DistrictsGeneralService } from './general';
import { ShortEngineerMemberDTO } from '../../engineers/dtos';

@Injectable()
export class DistrictsGettingService {
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly districtsGeneralService: DistrictsGeneralService,
  ) {}

  public async getAll(): Promise<DistrictsGetAllResponseBodyDTO> {
    return this.districtsRepository.getAll();
  }

  public async getEngineersById(
    districtId: number,
  ): Promise<ShortEngineerMemberDTO[]> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
    return this.districtsRepository.getEngineersById(districtId);
  }

  public async getById(districtId: number): Promise<DistrictWithStatisticsDTO> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
    return this.districtsRepository.getSingleDistrict(districtId);
  }

  public async getStatisticsById(
    districtId: number,
  ): Promise<DistrictStatisticDTO> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
    return this.districtsRepository.getDistrictStatisticById(districtId);
  }
}
