import { StationsCreateItemDTO } from '../dtos';

export type TStationsCreateItemWithWorker = Omit<
  StationsCreateItemDTO,
  'stationWorkerId'
> & {
  stationWorkerId: number;
  index: number;
};
