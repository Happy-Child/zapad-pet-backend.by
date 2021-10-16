import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import { ClientEntity } from '@app/entities';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ENTITIES_FIELDS, SORT_DURATION } from '@app/constants';
import { Expose, plainToClass } from 'class-transformer';

export class ClientsGettingRequestQueryDTO extends PaginationRequestDTO {
  @IsOptional()
  @IsIn([
    ENTITIES_FIELDS.NAME,
    ENTITIES_FIELDS.CREATED_AT,
    ENTITIES_FIELDS.STATIONS_COUNT,
  ])
  sortBy?:
    | ENTITIES_FIELDS.NAME
    | ENTITIES_FIELDS.CREATED_AT
    | ENTITIES_FIELDS.STATIONS_COUNT;

  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @IsOptional()
  @IsString()
  searchByName?: string;
}

export class ClientDTO extends ClientEntity {
  @Expose()
  stationsCount!: number;

  constructor(data: ClientDTO) {
    super();
    Object.assign(
      this,
      plainToClass(ClientDTO, data, { excludeExtraneousValues: true }),
    );
  }
}

export class ClientsGettingResponseBodyDTO extends PaginationResponseDTO<ClientDTO> {
  constructor(data: ClientsGettingResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new ClientDTO(item));
  }
}
