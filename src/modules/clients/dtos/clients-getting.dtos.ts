import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import { BaseEntity, ENTITIES_FIELDS } from '@app/entities';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { SORT_DURATION } from '@app/constants';

export class ClientsGettingRequestQueryDTO extends PaginationRequestDTO {
  @IsOptional()
  @IsIn([ENTITIES_FIELDS.NAME, ENTITIES_FIELDS.CREATED_AT])
  sortBy?: ENTITIES_FIELDS.NAME | ENTITIES_FIELDS.CREATED_AT;

  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @IsOptional()
  @IsString()
  searchByName?: string;
}

export class ClientsGettingResponseBodyDTO extends PaginationResponseDTO<BaseEntity> {
  constructor(data: ClientsGettingResponseBodyDTO) {
    super(data);
  }
}
