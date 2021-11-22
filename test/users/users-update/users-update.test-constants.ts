import { MOCK_ENGINEERS_MAP } from '../../../static/mock-data/users/engineers.mock';
import { MOCK_STATIONS_WORKERS_MAP } from '../../../static/mock-data/users/stations-workers.mock';
import { MOCK_STATIONS_MAP } from '../../../static/mock-data/stations/stations.mock';

export const TEST_USERS_UPDATE_STATIONS_WORKERS = [
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_6,
    clientId: null,
    stationId: null,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_8,
    clientId: MOCK_STATIONS_WORKERS_MAP.WORKER_6.clientId,
    stationId: MOCK_STATIONS_WORKERS_MAP.WORKER_6.stationId,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_7,
    stationId: MOCK_STATIONS_MAP.STATION_12.id,
  },
  {
    ...MOCK_STATIONS_WORKERS_MAP.WORKER_3,
    clientId: MOCK_STATIONS_MAP.STATION_10.clientId,
    stationId: MOCK_STATIONS_MAP.STATION_10.id,
  },
].sort((a, b) => a.id! - b.id!);

export const TEST_USERS_UPDATE_ENGINEERS = [
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_1,
    name: 'engineer 1 updated',
    email: 'engineer_updated_1@mail.ru',
  },
  MOCK_ENGINEERS_MAP.ENGINEER_2,
  MOCK_ENGINEERS_MAP.ENGINEER_3,
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_5,
    engineerDistrictId: null,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_7,
    engineerDistrictId: null,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_11,
    engineerDistrictId: MOCK_ENGINEERS_MAP.ENGINEER_7.engineerDistrictId,
  },
  {
    ...MOCK_ENGINEERS_MAP.ENGINEER_12,
    engineerDistrictId: MOCK_ENGINEERS_MAP.ENGINEER_7.engineerDistrictId,
  },
].sort((a, b) => a.id! - b.id!);
