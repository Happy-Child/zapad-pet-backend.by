import { ENTITIES_FIELDS } from '@app/constants';

export const USERS_LIST_DEFAULT_SORT_BY = ENTITIES_FIELDS.CREATED_AT;

export const USERS_MEMBER_RAW_SELECT = `u.*, sw.clientId as "clientId", sw.stationId as "stationId", dl.districtId as "leaderDistrictId", e.districtId as "engineerDistrictId"`;
