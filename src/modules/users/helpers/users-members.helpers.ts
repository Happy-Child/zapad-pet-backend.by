import { TFullMemberDTO, TMemberDTO } from '../types';
import { MEMBERS_ROLES, USER_ROLES } from '../constants';
import { isNull } from '@app/helpers';
import { SimpleUserDTO } from '../dtos';

export const isMember = (
  member: TMemberDTO | SimpleUserDTO,
): member is TMemberDTO => MEMBERS_ROLES.includes(member.role);

export const isFullMember = (member: TMemberDTO): member is TFullMemberDTO => {
  switch (member.role) {
    case USER_ROLES.STATION_WORKER:
      return !(isNull(member.clientId) || isNull(member.stationId));
    case USER_ROLES.DISTRICT_LEADER:
      return !isNull(member.leaderDistrictId);
    case USER_ROLES.ENGINEER:
      return !isNull(member.engineerDistrictId);
  }
};
