import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { MOCK_ACCOUNTANT, MOCK_MASTER } from './users.mock';
import { MOCK_ENGINEERS_MAP } from './engineers.mock';
import { MOCK_STATIONS_WORKERS_MAP } from './stations-workers.mock';
import { MOCK_DISTRICTS_LEADERS_MAP } from './districts-leaders.mock';

const data: Partial<
  UserEntity & StationWorkerEntity & DistrictLeaderEntity & EngineerEntity
>[] = [
  ...Object.values(MOCK_STATIONS_WORKERS_MAP),
  ...Object.values(MOCK_DISTRICTS_LEADERS_MAP),
  ...Object.values(MOCK_ENGINEERS_MAP),
  MOCK_MASTER,
  MOCK_ACCOUNTANT,
];

export default data;
