import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import {
  BID_STATUS,
  BID_STATUSES_ALLOWING_ASSIGNMENT_TO_ENGINEER,
} from '../constants';
import { USERS_ERRORS, BIDS_ERRORS } from '@app/constants';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { BidsGeneralService } from './bids-general.service';
import { isEngineer } from '../../users/helpers';
import { DistrictLeaderMemberJWTPayloadDTO } from '../../auth/dtos';

@Injectable()
export class BidsAssignToEngineerService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async executeOrFail(
    bidId: number,
    engineerId: number,
    leader: DistrictLeaderMemberJWTPayloadDTO,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(bidId, leader);

    if (!BID_STATUSES_ALLOWING_ASSIGNMENT_TO_ENGINEER.includes(bid.status)) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_ASSIGN_ENGINEER],
        },
      ]);
    }

    await this.engineerIsValidOrFail(engineerId, leader.leaderDistrictId);
    await this.bidsRepository.updateEntity(
      { id: bidId },
      { engineerId, status: BID_STATUS.PENDING_START_WORK_FROM_ENGINEER },
    );
  }

  private async engineerIsValidOrFail(
    engineerId: number,
    districtId: number,
  ): Promise<void> {
    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      id: engineerId,
    });

    if (!isEngineer(user)) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [USERS_ERRORS.SHOULD_BE_ENGINEER],
        },
      ]);
    }

    if (user.engineerDistrictId !== districtId) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.ENGINEER_HAVE_IS_ANOTHER_DISTRICT],
        },
      ]);
    }
  }
}
