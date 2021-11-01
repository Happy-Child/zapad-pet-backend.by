import { StationsUpdateItemDTO } from '../dtos';
import {
  TStationsUpdateItemWithoutWorker,
  TStationsUpdateItemWithWorker,
} from '../types';

export interface IGetGroupedStationsByChangedWorkers {
  toRemoving: TStationsUpdateItemWithoutWorker[];
  toAdding: TStationsUpdateItemWithWorker[];
  toReplacing: TStationsUpdateItemWithWorker[];
}

export interface IGetGroupedStationsByChangedFieldsReturn {
  byNumbers: (StationsUpdateItemDTO & { index: number })[];
  byDistrictsIds: (StationsUpdateItemDTO & { index: number })[];
  byClientsIds: (StationsUpdateItemDTO & { index: number })[];
  byWorkersIds: IGetGroupedStationsByChangedWorkers;
}
