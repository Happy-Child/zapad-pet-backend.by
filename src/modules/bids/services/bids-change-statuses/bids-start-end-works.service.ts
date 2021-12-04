import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { BidsRepository, BidsTodosRepository } from '../../repositories';
import { BidsGeneralService } from '../bids-general.service';
import {
  BID_STATUS,
  BID_STATUSES_ALLOWING_START_WORK,
  BID_TODO_STATUS,
  MAX_COUNT_BIDS_IN_WORK_ENGINEER,
} from '../../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS } from '@app/constants';
import { EngineerMemberJWTPayloadDTO } from '../../../auth/dtos';
import { EntityFinderGeneralService } from '../../../entity-finder/services';

@Injectable()
export class BidsStartEndWorksService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsTodosRepository: BidsTodosRepository,
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly finderGeneralService: EntityFinderGeneralService,
  ) {}

  public async startWorkOrFail(
    bidId: number,
    engineer: EngineerMemberJWTPayloadDTO,
  ): Promise<void> {
    await this.checkInWorkBidsCountOrFail(bidId);

    const bid = await this.bidsGeneralService.getBidByRoleOrFail(
      bidId,
      engineer,
    );

    if (!BID_STATUSES_ALLOWING_START_WORK.includes(bid.status)) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_START_WORK],
        },
      ]);
    }

    await this.resetBidData(bidId);

    await this.bidsRepository.updateEntity(
      { id: bidId },
      { status: BID_STATUS.IN_WORK, startWorkAt: moment().toISOString() },
    );
  }

  private async checkInWorkBidsCountOrFail(bidId: number): Promise<void> {
    const bidsInWork = await this.bidsRepository.getMany({
      id: bidId,
      status: BID_STATUS.IN_WORK,
    });

    if (bidsInWork.length >= MAX_COUNT_BIDS_IN_WORK_ENGINEER) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.MAX_COUNT_BIDS_IN_WORK],
        },
      ]);
    }
  }

  private async resetBidData(bidId: number): Promise<void> {
    const todos = await this.bidsGeneralService.getBidTodos(bidId);

    await this.bidsTodosRepository.saveEntities(
      todos.map((item, index) => ({
        ...item,
        status: index === 0 ? BID_TODO_STATUS.IN_WORK : BID_TODO_STATUS.PENDING,
      })),
    );
  }

  public async endWorkOrFail(
    bidId: number,
    engineer: EngineerMemberJWTPayloadDTO,
    finalPhotoId: number,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(
      bidId,
      engineer,
    );

    if (bid.status !== BID_STATUS.IN_WORK) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_END_WORK],
        },
      ]);
    }

    await this.finderGeneralService.getFileStorageOrFail(
      finalPhotoId,
      'imageFileId',
    );

    await this.allBidTodosCompletedOrFail(bidId);

    await this.bidsRepository.updateEntity(
      { id: bidId },
      {
        status: BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER,
        endWorkAt: moment().toISOString(),
        finalPhotoId,
      },
    );
  }

  private async allBidTodosCompletedOrFail(bidId: number): Promise<void> {
    const todos = await this.bidsTodosRepository.getMany({ bidId });

    const allTodosCompleted = todos.every(
      ({ status }) => status === BID_TODO_STATUS.COMPLETED,
    );

    if (!allTodosCompleted) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.ALL_BID_TODOS_SHOULD_BE_COMPLETED],
        },
      ]);
    }
  }
}
