import { StationEntity } from '@app/entities';

export class StationExtendedDTO extends StationEntity {
  stationWorkerId!: number | null;
}
