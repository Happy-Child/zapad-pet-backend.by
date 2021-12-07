import { Expose, plainToClass, Type } from 'class-transformer';
import { ShortUserDTO } from '@app/dtos';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

export class BidReviewDTO {
  @Type(() => ShortUserDTO)
  @Expose()
  user!: ShortUserDTO;

  @Expose()
  text!: string;
}

export class BidLastReviewResponseDTO {
  @Type(() => BidReviewDTO)
  @Expose()
  stationWorkerReview!: BidReviewDTO | null;

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
