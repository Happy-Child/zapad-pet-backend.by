import { StationEntity } from '@app/entities';

export class StationDTO extends StationEntity {
  stationWorkerId!: number | null;
}
