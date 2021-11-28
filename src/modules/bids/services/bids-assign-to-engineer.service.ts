import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BID_STATUS } from '../constants';
import { USERS_ERRORS, BIDS_ERRORS } from '@app/constants';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { BidsGeneralService } from './bids-general.service';
import { isEngineer } from '../../users/helpers';

@Injectable()
export class BidsAssignToEngineerService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async executeOrFail(
    bidId: number,
    userId: number,
    leaderDistrictId: number,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.bidExistOnDistrictOrFail(
      bidId,
      leaderDistrictId,
    );

    if (bid.status !== BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_ASSIGN_ENGINEER],
        },
      ]);
    }

    await this.engineerIsValidOrFail(userId, leaderDistrictId);
    await this.addEngineerToBid(bidId, userId);
  }

  private async engineerIsValidOrFail(
    userId: number,
    leaderDistrictId: number,
  ): Promise<void> {
    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      id: userId,
    });

    if (!isEngineer(user)) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [USERS_ERRORS.SHOULD_BE_ENGINEER],
        },
      ]);
    }

    if (user.engineerDistrictId !== leaderDistrictId) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.ENGINEER_HAVE_IS_ANOTHER_DISTRICT],
        },
      ]);
    }
  }

  private async addEngineerToBid(
    id: number,
    engineerId: number,
  ): Promise<void> {
    await this.bidsRepository.updateEntity({ id }, { engineerId });
  }
}
