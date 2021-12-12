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
} from './modules/bids/dtos';
import { DistrictLeaderMemberDTO } from './modules/districts-leaders/dtos';
import { EngineerMemberDTO } from './modules/engineers/dtos';
import { StationWorkerMemberDTO } from './modules/stations-workers/dtos';

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
    ],
  });
  SwaggerModule.setup(APPS.OPEN_API.PREFIX, app, document);
};
