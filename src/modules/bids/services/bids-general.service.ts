import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { Connection } from 'typeorm';
import {
  BID_STATUS,
  BID_STATUS_ALLOWING_UPDATES,
  BIDS_ERRORS,
} from '../constants';
import {
  ExceptionsForbidden,
  ExceptionsNotFound,
} from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';

const getNextBidStatusByEditable = (isEditable: boolean) =>
  isEditable ? BID_STATUS.EDITING : BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER;

@Injectable()
export class BidsGeneralService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
  ) {}

  async changeEditableStatus(
    bidId: number,
    stationId: number,
    isEditable: boolean,
  ): Promise<void> {
    const bid = await this.getBidByStationIdOrFail(bidId, stationId);
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
    if (
      ![BID_STATUS.EDITING, BID_STATUS_ALLOWING_UPDATES].includes(curStatus)
    ) {
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

  public async getBidByStationIdOrFail(
    bidId: number,
    stationId: number,
  ): Promise<BidEntity> {
    return this.bidsRepository.getOneOrFail(
      { id: bidId, stationId },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: 'id',
              messages: [BIDS_ERRORS.BID_NOT_FOUND],
            },
          ],
        },
      },
    );
  }
}
