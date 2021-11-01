import { StationsUpdateItemDTO } from '../dtos';

export type TIndexedStationsUpdateItemDTO = StationsUpdateItemDTO & {
  index: number;
};

export type TStationsUpdateItemWithWorker = Omit<
  StationsUpdateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: number;
  index: number;
};

export type TStationsUpdateItemWithoutWorker = Omit<
  StationsUpdateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: null;
  index: number;
};
