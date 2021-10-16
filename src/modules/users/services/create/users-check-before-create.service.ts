import { Injectable } from '@nestjs/common';
import { UsersGeneralCheckService } from '../general';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateStationWorkerDTO,
} from '../../dtos';
import { UsersDistrictsLeadersRepository } from '../../repositories';
import { ClientsRepository } from '../../../clients/repositories';
import { DistrictsRepository } from '../../../districts/repositories';
import { NonEmptyArray } from '@app/types';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly usersGeneralCheckService: UsersGeneralCheckService,
    private readonly usersDistrictsLeadersRepository: UsersDistrictsLeadersRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly districtsRepository: DistrictsRepository,
  ) {}

  public async checkStationWorkersOrFail(
    stationWorkers: NonEmptyArray<
      UsersCreateStationWorkerDTO & { index: number }
    >,
  ): Promise<void> {
    await this.clientsRepository.clientsExistsOrFail(stationWorkers);
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: NonEmptyArray<
      UsersCreateDistrictLeaderDTO & { index: number }
    >,
  ): Promise<void> {
    await this.districtsRepository.districtsExistsOrFail(districtLeaders);
    await this.usersDistrictsLeadersRepository.districtsWithoutLeadersOrFail(
      districtLeaders,
    );
  }

  public async checkEngineersOrFail(
    engineer: NonEmptyArray<UsersCreateEngineerDTO & { index: number }>,
  ): Promise<void> {
    await this.districtsRepository.districtsExistsOrFail(engineer);
  }
}
