import { DistrictLeaderEntity, UserEntity } from '@app/entities';
import { FAKE_DISTRICTS_LEADERS_MAP } from '@app/constants';

const districtsLeaders: Partial<UserEntity & DistrictLeaderEntity>[] = [
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_1,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_2,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_3,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_4,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_5,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_6,
  FAKE_DISTRICTS_LEADERS_MAP.LEADER_7,
];

export default districtsLeaders;
