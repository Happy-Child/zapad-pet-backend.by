import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../../repositories';
import { BidsGeneralService } from '../bids-general.service';
import { TMemberJwtPayloadDTO } from '../../../auth/types';
import { USER_ROLES } from '@app/constants';
import { SelectQueryBuilder } from 'typeorm';
import {
  BidEntity,
  DistrictLeaderEntity,
  DropboxStorageEntity,
  FileStorageEntity,
  LocalStorageEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import {
  GetBidSingleDistrictLeaderResponseDTO,
  GetBidSingleEngineerResponseDTO,
  GetBidSingleMasterResponseDTO,
  GetBidStationWorkerResponseDTO,
  TGetBidSingleResponseDTO,
} from '../../dtos';
import { MasterJWTPayloadDTO } from '../../../auth/dtos';

@Injectable()
export class BidsGettingSingleService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  public async getByIdOrFail(
    bidId: number,
    user: TMemberJwtPayloadDTO | MasterJWTPayloadDTO,
  ): Promise<TGetBidSingleResponseDTO> {
    await this.bidsGeneralService.getBidByRoleOrFail(bidId, user);

    const builder = this.bidsRepository.createQueryBuilder('b');

    this.mapBidGeneral(builder);

    switch (user.role) {
      case USER_ROLES.STATION_WORKER:
        return this.getBidForStationWorker(builder);
      case USER_ROLES.DISTRICT_LEADER:
        return this.getBidForDistrictLeader(builder);
      case USER_ROLES.ENGINEER:
        return this.getBidForEngineer(builder);
      default:
        return this.getBidForMaster(builder);
    }
  }

  private mapBidGeneral(builder: SelectQueryBuilder<BidEntity>): void {
    builder
      .leftJoin(FileStorageEntity, 'fs', 'fs.id = "b"."imageFileId"')
      .leftJoinAndMapOne(
        'b.imageLocal',
        LocalStorageEntity,
        'ls',
        'ls.id = "fs"."localId"',
      )
      .leftJoinAndMapOne(
        'b.imageDropbox',
        DropboxStorageEntity,
        'dbs',
        'dbs.id = "fs"."dropboxId"',
      );
  }

  private async getBidForStationWorker(
    builder: SelectQueryBuilder<BidEntity>,
  ): Promise<GetBidStationWorkerResponseDTO> {
    builder
      .leftJoinAndMapOne(
        'b.rejectedUser',
        UserEntity,
        'u1',
        'u1.id = "b"."rejectedUserId"',
      )
      .leftJoinAndMapOne(
        'b.confirmedStationWorker',
        UserEntity,
        'u2',
        'u2.id = "b"."confirmedStationWorkerId"',
      );

    const result =
      (await builder.getOne()) as unknown as GetBidStationWorkerResponseDTO;

    return new GetBidStationWorkerResponseDTO(result);
  }

  private mapBidForEngineer(builder: SelectQueryBuilder<BidEntity>): void {
    builder
      .leftJoin(FileStorageEntity, 'fs1', 'fs1.id = "b"."finalPhotoId"')
      .leftJoinAndMapOne(
        'b.finalPhotoLocal',
        LocalStorageEntity,
        'ls1',
        'ls1.id = "fs1"."localId"',
      )
      .leftJoinAndMapOne(
        'b.finalPhotoDropbox',
        DropboxStorageEntity,
        'dbs1',
        'dbs1.id = "fs1"."dropboxId"',
      )
      .leftJoinAndMapMany('b.todos', 'b.todos', 'bt');
  }

  private async getBidForEngineer(
    builder: SelectQueryBuilder<BidEntity>,
  ): Promise<GetBidSingleEngineerResponseDTO> {
    this.mapBidForEngineer(builder);

    const result =
      (await builder.getOne()) as unknown as GetBidSingleEngineerResponseDTO;

    return new GetBidSingleEngineerResponseDTO(result);
  }

  private mapBidForDistrictLeader(
    builder: SelectQueryBuilder<BidEntity>,
  ): void {
    this.mapBidForEngineer(builder);
    builder
      .leftJoinAndMapOne(
        'b.engineer',
        UserEntity,
        'u1',
        'u1.id = "b"."engineerId"',
      )
      .leftJoinAndMapOne(
        'b.rejectedUser',
        UserEntity,
        'u2',
        'u2.id = "b"."rejectedUserId"',
      );
  }

  private async getBidForDistrictLeader(
    builder: SelectQueryBuilder<BidEntity>,
  ): Promise<GetBidSingleDistrictLeaderResponseDTO> {
    this.mapBidForDistrictLeader(builder);

    const result =
      (await builder.getOne()) as unknown as GetBidSingleDistrictLeaderResponseDTO;

    return new GetBidSingleDistrictLeaderResponseDTO(result);
  }

  private async getBidForMaster(
    builder: SelectQueryBuilder<BidEntity>,
  ): Promise<GetBidSingleMasterResponseDTO> {
    this.mapBidForDistrictLeader(builder);

    builder
      .leftJoinAndMapOne('b.station', 'b.station', 'st')
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."stationId" = st.id')
      .leftJoin(
        DistrictLeaderEntity,
        'dl',
        '"dl"."leaderDistrictId" = "st"."districtId"',
      )
      .leftJoinAndMapOne(
        'b.stationWorker',
        UserEntity,
        'swu',
        'swu.id = "sw"."userId"',
      )
      .leftJoinAndMapOne(
        'b.districtLeader',
        UserEntity,
        'dlu',
        'dlu.id = "dl"."userId"',
      )
      .leftJoinAndMapOne(
        'b.confirmedStationWorker',
        UserEntity,
        'swu2',
        'swu2.id = "b"."confirmedStationWorkerId"',
      );

    const result =
      (await builder.getOne()) as unknown as GetBidSingleMasterResponseDTO;

    return new GetBidSingleMasterResponseDTO(result);
  }
}
