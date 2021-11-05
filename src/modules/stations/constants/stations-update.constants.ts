import { StationsUpdateItemDTO } from '../dtos';

export const GROUPED_UPDATING_STATIONS_FIELDS: (keyof StationsUpdateItemDTO)[] =
  ['number', 'districtId', 'clientId', 'stationWorkerId'];
