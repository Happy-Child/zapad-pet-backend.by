import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import {
  ArrayUnique,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ENTITIES_FIELDS, SORT_DURATION, USER_ROLES } from '@app/constants';
import { ALLOWED_ROLES } from '../constants';
import { TUserDTO } from '../types';
import { getSerializedMemberUser } from '../helpers';
import { Type } from 'class-transformer';

export class UsersGetListRequestQueryDTO extends PaginationRequestDTO {
  @IsOptional()
  @IsIn([
    ENTITIES_FIELDS.ID,
    ENTITIES_FIELDS.NAME,
    ENTITIES_FIELDS.EMAIL,
    ENTITIES_FIELDS.CREATED_AT,
    ENTITIES_FIELDS.ROLE,
  ])
  sortBy?:
    | ENTITIES_FIELDS.ID
    | ENTITIES_FIELDS.NAME
    | ENTITIES_FIELDS.EMAIL
    | ENTITIES_FIELDS.CREATED_AT
    | ENTITIES_FIELDS.ROLE;

  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @IsOptional()
  @ArrayUnique()
  @IsIn(ALLOWED_ROLES, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  role?: USER_ROLES[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leaderDistrictId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  engineerDistrictId?: number;
}

export class UsersGetListResponseBodyDTO extends PaginationResponseDTO<TUserDTO> {
  constructor(data: UsersGetListResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => getSerializedMemberUser(item));
  }
}
