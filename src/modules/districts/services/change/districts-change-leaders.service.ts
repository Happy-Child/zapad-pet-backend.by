import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DistrictsGeneralService } from '../general';
import { EntityFinderGeneralService } from '../../../entity-finder/services';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { USERS_ERRORS } from '../../../users/constants';
import { DistrictLeaderMemberDTO } from '../../../districts-leaders/dtos';
import { BidEntity, StationEntity } from '@app/entities';
import {
  BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT,
  DISTRICTS_ERRORS,
} from '../../constants';
import { DistrictsRepository } from '../../repositories';
import { isUndefined } from '@app/helpers';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';
import { isDistrictLeader } from '../../../users/helpers';

@Injectable()
export class DistrictsChangeLeadersService {
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly connection: Connection,
  ) {}

  public async changeLeader(districtId: number, userId: number): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
    await this.canBeAddLeaderToDistrictOrFail(userId);
    await this.canBeRemoveLeaderFromDistrictOrFail(districtId);
    await this.removeAndReplaceDistrictLeader(districtId, userId);
  }

  public async deleteLeader(districtId: number): Promise<void> {
    await this.districtsGeneralService.getDistrictOrFail(districtId);
    await this.canBeRemoveLeaderFromDistrictOrFail(districtId);
    await this.removeAndReplaceDistrictLeader(districtId);
  }

  private async canBeAddLeaderToDistrictOrFail(
    userId: number,
  ): Promise<DistrictLeaderMemberDTO> {
    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      id: userId,
    });

    if (!isDistrictLeader(user)) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'userId',
          messages: [USERS_ERRORS.SHOULD_BE_DISTRICT_LEADER],
        },
      ]);
    }

    if (user.leaderDistrictId) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'userId',
          messages: [USERS_ERRORS.LEADER_SHOULD_BE_WITHOUT_DISTRICT],
        },
      ]);
    }

    return user;
  }

  private async canBeRemoveLeaderFromDistrictOrFail(
    districtId: number,
  ): Promise<void> {
    const record = await this.districtsRepository
      .createQueryBuilder('d')
      .select('COUNT(b.id)::int')
      .where({ id: districtId })
      .leftJoin(StationEntity, 'st', `"st"."districtId" = d.id`)
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = st.id AND b.status IN (:...statuses)`,
        { statuses: BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT },
      )
      .groupBy('b.id')
      .getRawOne<{ count: number }>();

    if (!isUndefined(record) && record.count > 0) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'id',
          messages: [DISTRICTS_ERRORS.IMPOSSIBLE_REMOVE_LEADER_FROM_DISTRICT],
        },
      ]);
    }
  }

  private async removeAndReplaceDistrictLeader(
    leaderDistrictId: number,
    userId?: number,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const districtsLeadersRepository = manager.getCustomRepository(
        DistrictsLeadersRepository,
      );
      await districtsLeadersRepository.updateEntity(
        { leaderDistrictId },
        { leaderDistrictId: null },
      );
      if (userId) {
        await districtsLeadersRepository.updateEntity(
          { userId },
          { leaderDistrictId },
        );
      }
    });
  }
}
