import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { APPS } from 'config';
import projectData from 'package.json';
import { AccountantDTO, MasterDTO } from './modules/users/dtos';
import {
  GetListBidsDistrictLeaderResponseDTO,
  GetListBidsEngineerResponseDTO,
  GetListBidsMasterResponseDTO,
  GetListBidsStationWorkerResponseDTO,
  GetListBidsGeneralItemDTO,
  GetBidSingleEngineerResponseDTO,
  GetBidSingleDistrictLeaderResponseDTO,
  GetBidStationWorkerResponseDTO,
  GetBidSingleMasterResponseDTO,
  BidDTO,
  GetListBidsEngineerQueryDTO,
  GetListBidsDistrictLeaderQueryDTO,
  GetListBidsStationWorkerQueryDTO,
  GetListBidsMasterQueryDTO,
} from './modules/bids/dtos';
import { DistrictLeaderMemberDTO } from './modules/districts-leaders/dtos';
import { EngineerMemberDTO } from './modules/engineers/dtos';
import { StationWorkerMemberDTO } from './modules/stations-workers/dtos';
import { StationsGetListRequestQueryDTO } from './modules/stations/dtos/stations-getting.dtos';
import { UsersGetListRequestQueryDTO } from './modules/users/dtos/users-getting.dtos';
import { ClientsGettingRequestQueryDTO } from './modules/clients/dtos';

export const swaggerBootstrap = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle(projectData.name)
    .setVersion(projectData.version)
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      AccountantDTO,
      DistrictLeaderMemberDTO,
      EngineerMemberDTO,
      StationWorkerMemberDTO,
      MasterDTO,
      GetListBidsGeneralItemDTO,
      GetListBidsEngineerResponseDTO,
      GetListBidsDistrictLeaderResponseDTO,
      GetListBidsStationWorkerResponseDTO,
      GetListBidsMasterResponseDTO,
      GetBidSingleEngineerResponseDTO,
      GetBidSingleDistrictLeaderResponseDTO,
      GetBidStationWorkerResponseDTO,
      GetBidSingleMasterResponseDTO,
      BidDTO,
      GetListBidsEngineerQueryDTO,
      GetListBidsDistrictLeaderQueryDTO,
      GetListBidsStationWorkerQueryDTO,
      GetListBidsMasterQueryDTO,
      StationsGetListRequestQueryDTO,
      UsersGetListRequestQueryDTO,
      ClientsGettingRequestQueryDTO,
    ],
  });
  SwaggerModule.setup(APPS.OPEN_API.PREFIX, app, document);
};
