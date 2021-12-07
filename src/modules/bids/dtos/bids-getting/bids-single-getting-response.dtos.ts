import { BidDTO, BidTodoDTO } from '../bids-general.dtos';
import { Expose, Type } from 'class-transformer';
import { ShortUserWithEmailDTO } from '@app/dtos';
import { IStorageFile } from '@app/file-storage/interfaces';
import { NonEmptyArray } from '@app/types';
import { ClientEntity } from '@app/entities';

export class GetBidSingleEngineerDTO extends BidDTO {
  @Expose()
  finalPhoto!: IStorageFile | null;

  @Type(() => BidTodoDTO)
  @Expose()
  todos!: NonEmptyArray<BidTodoDTO>;
}

export class GetBidSingleDistrictLeaderDTO extends GetBidSingleEngineerDTO {
  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  rejectedUser!: ShortUserWithEmailDTO | null;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  engineer!: ShortUserWithEmailDTO | null;

  @Expose()
  createdAt!: string;

  @Expose()
  startWorkAt!: string | null;

  @Expose()
  endWorkAt!: string | null;
}

export class GetBidStationWorkerResponseDTO extends BidDTO {
  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  rejectedUser!: ShortUserWithEmailDTO | null;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  confirmedStationWorker!: ShortUserWithEmailDTO | null;

  @Expose()
  confirmSuccessAt!: string | null;

  @Expose()
  createdAt!: string;
}

export class GetBidSingleMasterDTO extends GetBidSingleDistrictLeaderDTO {
  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  stationWorker!: ShortUserWithEmailDTO;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  districtLeader!: ShortUserWithEmailDTO;

  @Type(() => ClientEntity)
  @Expose()
  client!: ClientEntity;

  @Expose()
  districtId!: number;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  confirmedStationWorker!: ShortUserWithEmailDTO | null;

  @Expose()
  confirmSuccessAt!: string | null;
}
