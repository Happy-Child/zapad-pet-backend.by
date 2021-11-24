import { Injectable } from '@nestjs/common';
import { StationsRepository } from '../repositories';
import {
  StationsGetListRequestQueryDTO,
  StationsGetListResponseBodyDTO,
  StationWithStatisticsDTO,
} from '../dtos/stations-getting.dtos';

@Injectable()
export class StationsGettingService {
  constructor(private readonly stationsRepository: StationsRepository) {}

  public async getById(id: number): Promise<StationWithStatisticsDTO> {
    return this.stationsRepository.getStationByIdOrFail(id);
  }

  public async getList(
    query: StationsGetListRequestQueryDTO,
  ): Promise<StationsGetListResponseBodyDTO> {
    return this.stationsRepository.getStationsWithPagination(query);
  }
}
