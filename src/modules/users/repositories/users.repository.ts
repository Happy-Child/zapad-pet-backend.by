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
import { TMemberDTO } from '../types';
import { RepositoryFindConditions } from '@app/repositories/types';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  public async getUserOrFail(
    conditions: RepositoryFindConditions<UserEntity>,
    serializeOptions?: ClassTransformOptions,
  ): Promise<TMemberDTO | SimpleUserDTO> {
    const rawUser = await this.createQueryBuilder('u')
      .select(
        `u.*, sw.clientId as "clientId", sw.stationId as "stationId", dl.districtId as "leaderDistrictId", e.districtId as "engineerDistrictId"`,
      )
      .where(conditions)
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."userId" = u.id')
      .leftJoin(DistrictLeaderEntity, 'dl', '"dl"."userId" = u.id')
      .leftJoin(EngineerEntity, 'e', '"e"."userId" = u.id')
      .getRawOne();

    if (!rawUser) {
      throw new ExceptionsNotFound([
        { field: ENTITIES_FIELDS.ID, messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }

    return UsersRepository.getPreparedMember(rawUser, serializeOptions);
  }

  private static getPreparedMember(
    rawUser: any,
    serializeOptions?: ClassTransformOptions,
  ): TMemberDTO | SimpleUserDTO {
    switch (rawUser.role) {
      case USER_ROLES.STATION_WORKER:
        return new StationWorkerMemberDTO(rawUser, serializeOptions);
      case USER_ROLES.DISTRICT_LEADER:
        return new DistrictLeaderMemberDTO(rawUser, serializeOptions);
      case USER_ROLES.ENGINEER:
        return new EngineerMemberDTO(rawUser, serializeOptions);
      default:
        return new SimpleUserDTO(rawUser, serializeOptions);
    }
  }
}
