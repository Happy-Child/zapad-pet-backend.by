import { Expose, plainToClass, Type } from 'class-transformer';
import { ShortUserDTO } from '@app/dtos';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class BidReviewDTO {
  @ApiProperty({ type: ShortUserDTO })
  @Type(() => ShortUserDTO)
  @Expose()
  user!: ShortUserDTO;

  @ApiProperty()
  @Expose()
  text!: string;
}

export class BidLastReviewResponseDTO {
  @ApiProperty({ type: BidReviewDTO, nullable: true })
  @Type(() => BidReviewDTO)
  @Expose()
  stationWorkerReview!: BidReviewDTO | null;

  @ApiProperty({ type: BidReviewDTO, nullable: true })
  @Type(() => BidReviewDTO)
  @Expose()
  districtLeaderReview!: BidReviewDTO | null;

  constructor(
    data: Partial<BidLastReviewResponseDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(BidLastReviewResponseDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
