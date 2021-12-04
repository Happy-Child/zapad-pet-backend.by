import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../../repositories';
import { BidsGeneralService } from '../bids-general.service';
import { TJwtPayloadDTO } from '../../../auth/types';
import { BidEntity } from '@app/entities';
import { BID_STATUS, BID_STATUSES_ALLOWING_CANCEL } from '../../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS } from '@app/constants';

@Injectable()
export class BidsCancelService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  public async executeOrFail(
    bidId: number,
    user: TJwtPayloadDTO,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(bidId, user);

    this.isValidStatusForCancel(bid);

    await this.bidsRepository.updateEntity(
      { id: bidId },
      { rejectedUserId: user.userId, status: BID_STATUS.CANCEL },
    );
  }

  private isValidStatusForCancel({ status }: Pick<BidEntity, 'status'>): void {
    if (!BID_STATUSES_ALLOWING_CANCEL.includes(status)) {
      throw new ExceptionsForbidden([
        {
          field: '',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_CANCEL],
        },
      ]);
    }
  }
}
