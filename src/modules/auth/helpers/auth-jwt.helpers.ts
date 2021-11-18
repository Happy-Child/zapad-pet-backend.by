import { TFullMemberDTO } from '../../users/types';
import { TMemberJWTPayloadDTO } from '../types';
import { USER_ROLES } from '@app/constants';

export const getJWTPayloadByMember = (
  member: TFullMemberDTO,
): TMemberJWTPayloadDTO => {
  const result = { userId: member.id };

  switch (member.role) {
    case USER_ROLES.STATION_WORKER:
      return {
        ...result,
        role: member.role,
        clientId: member.clientId,
        stationId: member.stationId,
      };
    case USER_ROLES.DISTRICT_LEADER:
      return {
        ...result,
        role: member.role,
        leaderDistrictId: member.leaderDistrictId,
      };
    case USER_ROLES.ENGINEER:
      return {
        ...result,
        role: member.role,
        engineerDistrictId: member.engineerDistrictId,
      };
  }
};
