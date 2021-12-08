import { BidEntity, BidTodoEntity } from '@app/entities';
import { MOCK_STATIONS_MAP } from '../stations/stations.mock';
import moment from 'moment';
import { MOCK_ENGINEERS_MAP } from '../users/engineers.mock';
import { BID_TODO_STATUS } from '../../../src/modules/bids/constants';

export const MOCK_BIDS_MAP: Record<
  string,
  Omit<Partial<BidEntity>, 'todos'> & { todos: Partial<BidTodoEntity>[] }
> = {
  BID_1: {
    id: 1,
    stationId: MOCK_STATIONS_MAP.STATION_1.id,
    deadlineAt: moment().add(2, 'months').toISOString(),
    engineerId: MOCK_ENGINEERS_MAP.ENGINEER_1.id,
    todos: [
      {
        status: BID_TODO_STATUS.IN_WORK,
        text: 'Test todo item 1',
      },
    ],
  },
  BID_2: {
    id: 2,
    stationId: MOCK_STATIONS_MAP.STATION_1.id,
    deadlineAt: moment().add(2, 'months').toISOString(),
    engineerId: MOCK_ENGINEERS_MAP.ENGINEER_1.id,
    todos: [
      {
        status: BID_TODO_STATUS.IN_WORK,
        text: 'Test todo item 1',
      },
    ],
  },
};
