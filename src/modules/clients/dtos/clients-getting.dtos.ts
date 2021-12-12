import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import { ClientEntity } from '@app/entities';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { SORT_DURATION } from '@app/constants';
import { Expose, plainToClass } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CLIENTS_SORT_BY } from '../constants';

export class ClientsGettingRequestQueryDTO extends PaginationRequestDTO {
  @ApiPropertyOptional({ enum: CLIENTS_SORT_BY })
  @IsOptional()
  @IsIn(CLIENTS_SORT_BY)
  sortBy?: typeof CLIENTS_SORT_BY[number];

  @ApiPropertyOptional({ enum: SORT_DURATION })
  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchByName?: string;
}

export class ClientExtendedDTO extends ClientEntity {
  @ApiProperty()
  @Expose()
  stationsCount!: number;

  constructor(data: ClientExtendedDTO) {
    super();
    Object.assign(
      this,
      plainToClass(ClientExtendedDTO, data, { excludeExtraneousValues: true }),
    );
  }
}

export class ClientsGettingResponseBodyDTO extends PaginationResponseDTO<ClientExtendedDTO> {
  @ApiProperty({ type: ClientExtendedDTO, isArray: true })
  @Expose()
  items!: ClientExtendedDTO[];

  constructor(data: ClientsGettingResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new ClientExtendedDTO(item));
  }
}
