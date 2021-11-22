import { BidEntity, BidTodoEntity } from '@app/entities';
import { MOCK_STATIONS_MAP } from '../stations/stations.mock';

export const MOCK_BIDS_MAP: Record<
  string,
  Omit<Partial<BidEntity>, 'todos'> & { todos: Partial<BidTodoEntity>[] }
> = {
  BID_1: {
    id: 1,
    stationId: MOCK_STATIONS_MAP.STATION_1.id,
    todos: [
      {
        text: 'Test todo item 1',
      },
    ],
  },
  BID_2: {
    id: 2,
    stationId: MOCK_STATIONS_MAP.STATION_1.id,
    todos: [
      {
        text: 'Test todo item 1',
      },
    ],
  },
  BID_3: {
    id: 3,
    stationId: MOCK_STATIONS_MAP.STATION_1.id,
    todos: [
      {
        text: 'Test todo item 1',
      },
    ],
  },
  BID_4: {
    id: 4,
    stationId: MOCK_STATIONS_MAP.STATION_2.id,
    todos: [
      {
        text: 'Test todo item 1',
      },
    ],
  },
  BID_5: {
    id: 5,
    stationId: MOCK_STATIONS_MAP.STATION_2.id,
    todos: [
      {
        text: 'Test todo item 1',
      },
    ],
  },
};
