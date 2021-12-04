import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../../repositories';
import { Connection } from 'typeorm';
import {
  BID_STATUS,
  BID_STATUSES_ALLOWING_CHANGE_EDIT_STATUS,
} from '../../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS } from '@app/constants';
import { BidsGeneralService } from '../bids-general.service';
import { StationWorkerMemberJWTPayloadDTO } from '../../../auth/dtos';

const getNextBidStatusByEditable = (isEditable: boolean) =>
  isEditable ? BID_STATUS.EDITING : BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER;

@Injectable()
export class BidsChangeEditableStatusService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  async executeOrFail(
    bidId: number,
    worker: StationWorkerMemberJWTPayloadDTO,
    isEditable: boolean,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(bidId, worker);
    const nextStatus = getNextBidStatusByEditable(isEditable);

    this.isAllowEditBidOrFail(bid.status, nextStatus);

    await this.bidsRepository.saveEntity({
      ...bid,
      status: nextStatus,
    });
  }

  private isAllowEditBidOrFail(
    curStatus: BID_STATUS,
    nextStatus: BID_STATUS,
  ): void {
    if (!BID_STATUSES_ALLOWING_CHANGE_EDIT_STATUS.includes(curStatus)) {
      throw new ExceptionsForbidden([
        {
          field: '',
          messages: [BIDS_ERRORS.BID_FORBIDDEN_TO_EDIT],
        },
      ]);
    }

    if (curStatus === nextStatus) {
      throw new ExceptionsForbidden([
        {
          field: '',
          messages: [BIDS_ERRORS.BID_HAS_THIS_STATUS],
        },
      ]);
    }
  }
}
