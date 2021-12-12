import { IsOptional, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PAGINATION_DEFAULT_TAKE_RANGE } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestDTO {
  @ApiProperty({
    type: Number,
    required: true,
    minimum: PAGINATION_DEFAULT_TAKE_RANGE.MIN,
  })
  @Type(() => Number)
  @Min(PAGINATION_DEFAULT_TAKE_RANGE.MIN)
  take!: number;

  @ApiProperty({
    type: Number,
    required: false,
    minimum: PAGINATION_DEFAULT_TAKE_RANGE.MIN,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(PAGINATION_DEFAULT_TAKE_RANGE.MIN)
  skip?: number;
}

export class PaginationResponseDTO<T> {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  totalItemsCount!: number;

  @ApiProperty({
    type: Object,
    isArray: true,
  })
  @Expose()
  items!: T[];

  @ApiProperty({
    type: Number,
  })
  @Expose()
  take!: number;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  skip!: number;
}
