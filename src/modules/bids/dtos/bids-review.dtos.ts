import { IsInt, IsString, Max, Min } from 'class-validator';
import { MAX_INTEGER } from '@app/constants';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BidsSetReviewStatusRequestParamsDTO {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  bidId!: number;
}

export class BidsSetRejectedReviewStatusRequestBodyDTO {
  @ApiProperty()
  @IsString()
  text!: string;
}
