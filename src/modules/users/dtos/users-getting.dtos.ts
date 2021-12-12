import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import {
  ArrayUnique,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { SORT_DURATION, USER_ROLES } from '@app/constants';
import { ALLOWED_ROLES, USERS_SORT_BY } from '../constants';
import { TUserDTO } from '../types';
import { Type } from 'class-transformer';
import { getSerializedMemberUser } from '../helpers';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { AccountantDTO, MasterDTO } from './users-members.dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { EngineerMemberDTO } from '../../engineers/dtos';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';

export class UsersGetListRequestQueryDTO extends PaginationRequestDTO {
  @ApiPropertyOptional({ enum: USERS_SORT_BY })
  @IsOptional()
  @IsIn(USERS_SORT_BY)
  sortBy?: typeof USERS_SORT_BY[number];

  @ApiPropertyOptional({ enum: SORT_DURATION })
  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @ApiPropertyOptional({ enum: ALLOWED_ROLES, isArray: true })
  @IsOptional()
  @ArrayUnique()
  @IsIn(ALLOWED_ROLES, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  role?: USER_ROLES[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leaderDistrictId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  engineerDistrictId?: number;
}

export class UsersGetListResponseBodyDTO extends PaginationResponseDTO<TUserDTO> {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(MasterDTO) },
      { $ref: getSchemaPath(AccountantDTO) },
      { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
      { $ref: getSchemaPath(EngineerMemberDTO) },
      { $ref: getSchemaPath(StationWorkerMemberDTO) },
    ],
  })
  @Expose()
  items!: TUserDTO[];

  constructor(data: UsersGetListResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => getSerializedMemberUser(item));
  }
}
