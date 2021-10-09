import { EntityRepository } from 'typeorm';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '../entities';
import { GeneralRepository } from '@app/repositories';
import {
  DistrictLeaderMemberDTO,
  EngineerMemberDTO,
  SimpleUserDTO,
  StationWorkerMemberDTO,
} from '../dtos';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { USER_ROLES } from '../constants';
import { TMember } from '../types';
import { RepositoryFindConditions } from '@app/repositories/types';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  public async getMemberOrFail(
    conditions: RepositoryFindConditions<UserEntity>,
    serializeOptions?: ClassTransformOptions,
  ): Promise<TMember> {
    const rawMember = await this.createQueryBuilder('u')
      .select(
        `u.*, sw.clientId as "clientId", sw.stationId as "stationId", dl.districtId as "leaderDistrictId", e.districtId as "engineerDistrictId"`,
      )
      .where(conditions)
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."userId" = u.id')
      .leftJoin(DistrictLeaderEntity, 'dl', '"dl"."userId" = u.id')
      .leftJoin(EngineerEntity, 'e', '"e"."userId" = u.id')
      .getRawOne<TMember>();

    if (!rawMember) {
      throw new ExceptionsNotFound([
        { field: ENTITIES_FIELDS.ID, messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }

    return UsersRepository.getPreparedMember(rawMember, serializeOptions);
  }

  private static getPreparedMember(
    rawMember: TMember,
    serializeOptions?: ClassTransformOptions,
  ): TMember {
    switch (rawMember.role) {
      case USER_ROLES.STATION_WORKER:
        return new StationWorkerMemberDTO(rawMember, serializeOptions);
      case USER_ROLES.DISTRICT_LEADER:
        return new DistrictLeaderMemberDTO(rawMember, serializeOptions);
      case USER_ROLES.ENGINEER:
        return new EngineerMemberDTO(rawMember, serializeOptions);
      default:
        return new SimpleUserDTO(rawMember, serializeOptions);
    }
  }
}
