import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { USER_ROLES } from '@app/constants';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ShortUserDTO } from '@app/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class StationWorkerMemberDTO extends UserEntity {
  @ApiProperty({ type: USER_ROLES.STATION_WORKER })
  @Expose()
  role!: USER_ROLES.STATION_WORKER;

  @ApiProperty({ type: Number })
  @Expose()
  clientId!: number | null;

  @ApiProperty({ type: Number })
  @Expose()
  stationId!: number | null;

  constructor(
    data: StationWorkerMemberDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(StationWorkerMemberDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class ShortStationWorkerMemberDTO extends ShortUserDTO {
  constructor(data: ShortStationWorkerMemberDTO) {
    super(data);
  }
}
