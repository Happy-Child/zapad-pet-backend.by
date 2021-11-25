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

  public async getEngineersById(id: number): Promise<ShortEngineerMemberDTO[]> {
    await this.districtsGeneralService.getDistrictOrFail(id);
    return this.districtsRepository.getEngineersById(id);
  }

  public async getById(id: number): Promise<DistrictWithStatisticsDTO> {
    await this.districtsGeneralService.getDistrictOrFail(id);
    return this.districtsRepository.getSingleDistrict(id);
  }

  public async getStatisticsById(id: number): Promise<DistrictStatisticDTO> {
    await this.districtsGeneralService.getDistrictOrFail(id);
    return this.districtsRepository.getDistrictStatisticById(id);
  }
}
