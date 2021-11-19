import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { FAKE_ACCOUNTANT, FAKE_MASTER } from '@app/constants';
import stationWorkers from './users/stations-workers.fake';
import districtsLeaders from './users/districts-leaders.fake';
import engineers from './users/engineers.fake';

const data: Partial<
  UserEntity & StationWorkerEntity & DistrictLeaderEntity & EngineerEntity
>[] = [
  ...stationWorkers,
  ...districtsLeaders,
  ...engineers,
  FAKE_MASTER,
  FAKE_ACCOUNTANT,
];

export default data;
