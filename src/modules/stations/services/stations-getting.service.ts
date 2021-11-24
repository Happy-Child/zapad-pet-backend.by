import { Injectable } from '@nestjs/common';
import { StationsRepository } from '../repositories';
import {
  StationsGetListRequestQueryDTO,
  StationsGetListResponseBodyDTO,
  StationStatisticDTO,
  StationWithStatisticsDTO,
} from '../dtos/stations-getting.dtos';

@Injectable()
export class StationsGettingService {
  constructor(private readonly stationsRepository: StationsRepository) {}

  public async getById(id: number): Promise<StationWithStatisticsDTO> {
    return this.stationsRepository.getStationWithStatisticOrFail(id);
  }

  public async getStatisticsById(id: number): Promise<StationStatisticDTO> {
    return this.stationsRepository.getStationStatisticById(id);
  }

  public async getList(
    query: StationsGetListRequestQueryDTO,
  ): Promise<StationsGetListResponseBodyDTO> {
    return this.stationsRepository.getStationsWithPagination(query);
  }
}
