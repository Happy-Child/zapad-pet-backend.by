import { StationsUpdateItemDTO } from '../dtos';

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

export type TGroupedStationsUpdatedFields = Pick<
  StationsUpdateItemDTO,
  'id' | 'number' | 'districtId' | 'clientId' | 'stationWorkerId'
> & { index: number };
