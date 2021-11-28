import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { TFullMemberDTO, TMemberDTO, TUserDTO } from '../types';
import { MEMBERS_ROLES } from '../constants';
import { isNull } from '@app/helpers';
import { AccountantDTO, MasterDTO } from '../dtos';
import { USER_ROLES } from '@app/constants';
import { EngineerMemberDTO } from '../../engineers/dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';
import { UserEntity } from '@app/entities';

export const isMember = (member: TUserDTO): member is TMemberDTO =>
  MEMBERS_ROLES.includes(member.role);

export const isFullMember = (member: TMemberDTO): member is TFullMemberDTO => {
  switch (member.role) {
    case USER_ROLES.STATION_WORKER:
      return !isNull(member.clientId) && !isNull(member.stationId);
    case USER_ROLES.DISTRICT_LEADER:
      return !isNull(member.leaderDistrictId);
    case USER_ROLES.ENGINEER:
      return !isNull(member.engineerDistrictId);
    default:
      return false;
  }
};

export const getSerializedMemberUser = (
  rawUser: any,
  serializeOptions?: ClassTransformOptions,
): TUserDTO => {
  switch (rawUser.role) {
    case USER_ROLES.STATION_WORKER:
      return new StationWorkerMemberDTO(rawUser, serializeOptions);
    case USER_ROLES.DISTRICT_LEADER:
      return new DistrictLeaderMemberDTO(rawUser, serializeOptions);
    case USER_ROLES.ENGINEER:
      return new EngineerMemberDTO(rawUser, serializeOptions);
    case USER_ROLES.ACCOUNTANT:
      return new AccountantDTO(rawUser, serializeOptions);
    default:
      return new MasterDTO(rawUser, serializeOptions);
  }
};

export const isEngineer = (user: UserEntity): user is EngineerMemberDTO =>
  user.role === USER_ROLES.ENGINEER && user instanceof EngineerMemberDTO;

export const isDistrictLeader = (
  user: UserEntity,
): user is DistrictLeaderMemberDTO =>
  user.role === USER_ROLES.DISTRICT_LEADER &&
  user instanceof DistrictLeaderMemberDTO;
