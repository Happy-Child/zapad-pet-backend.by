import { IsOptional, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PAGINATION_DEFAULT_TAKE_RANGE } from '@app/constants';

export class PaginationRequestDTO {
  @Type(() => Number)
  @Min(PAGINATION_DEFAULT_TAKE_RANGE.MIN)
  take!: number;

  @IsOptional()
  @Type(() => Number)
  @Min(PAGINATION_DEFAULT_TAKE_RANGE.MIN)
  skip?: number;
}

export class PaginationResponseDTO<T> {
  @Expose()
  totalItemsCount!: number;

  @Expose()
  items!: T[];

  @Expose()
  take!: number;

  @Expose()
  skip!: number;
}
