import { StationWorkerEntity } from '@app/entities';

const data: Partial<StationWorkerEntity>[] = [
  {
    userId: 1,
    clientId: 1,
    stationId: 2,
  },
  {
    userId: 2,
    clientId: 1,
    stationId: 3,
  },
  {
    userId: 3,
    clientId: 1,
    stationId: null,
  },
  {
    userId: 4,
    clientId: 2,
    stationId: 6,
  },
  {
    userId: 5,
    clientId: 2,
    stationId: 7,
  },
  {
    userId: 6,
    clientId: 3,
    stationId: 8,
  },
  {
    userId: 7,
    clientId: 4,
    stationId: 12,
  },
  {
    userId: 8,
    clientId: 4,
    stationId: null,
  },
];

export default data;
