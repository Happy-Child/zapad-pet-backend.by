import { Injectable } from '@nestjs/common';
import { StationsRepository } from '../repositories';
import {
  StationsGetListRequestQueryDTO,
  StationsGetListResponseBodyDTO,
  StationStatisticDTO,
  StationWithStatisticsDTO,
} from '../dtos/stations-getting.dtos';
import { StationsGeneralService } from './general';
import { BidsGeneralService } from '../../bids/services';

@Injectable()
export class StationsGettingService {
  constructor(
    private readonly stationsGeneralService: StationsGeneralService,
    private readonly stationsRepository: StationsRepository,
  ) {}

  public async getById(id: number): Promise<StationWithStatisticsDTO> {
    await this.stationsGeneralService.getStationOrFail(id);
    return this.stationsRepository.getSingleStation(id);
  }

  public async getStatisticsById(id: number): Promise<StationStatisticDTO> {
    const station = await this.stationsGeneralService.getStationOrFail(id);
    return new StationStatisticDTO({
      bidsCountByStatuses: BidsGeneralService.getAggrBidsCountByStatuses(
        station.bids,
      ),
    });
  }

  public async getList(
    query: StationsGetListRequestQueryDTO,
  ): Promise<StationsGetListResponseBodyDTO> {
    return this.stationsRepository.getStationsWithPagination(query);
  }
}
