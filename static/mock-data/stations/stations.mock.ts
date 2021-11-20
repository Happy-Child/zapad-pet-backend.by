import { StationEntity } from '@app/entities';

// 12 entities
// clientId=1 - stationId=2,3,4
// clientId=2 - stationId=1,5,6,7
// clientId=3 - stationId=8,9,10
// clientId=4 - stationId=11,12
export const MOCK_STATIONS_MAP: Record<string, Partial<StationEntity>> = {
  STATION_1: {
    id: 1,
    number: 'NMB0000001',
    districtId: 1,
    clientId: 2,
  },
  STATION_2: {
    id: 2,
    number: 'NMB0000002',
    districtId: 2,
    clientId: 1,
  },
  STATION_3: {
    id: 3,
    number: 'NMB0000003',
    districtId: 2,
    clientId: 1,
  },
  STATION_4: {
    id: 4,
    number: 'NMB0000004',
    districtId: 2,
    clientId: 1,
  },
  STATION_5: {
    id: 5,
    number: 'NMB0000005',
    districtId: 2,
    clientId: 2,
  },
  STATION_6: {
    id: 6,
    number: 'NMB0000006',
    districtId: 3,
    clientId: 2,
  },
  STATION_7: {
    id: 7,
    number: 'NMB0000007',
    districtId: 3,
    clientId: 2,
  },
  STATION_8: {
    id: 8,
    number: 'NMB0000008',
    districtId: 3,
    clientId: 3,
  },
  STATION_9: {
    id: 9,
    number: 'NMB0000009',
    districtId: 3,
    clientId: 3,
  },
  STATION_10: {
    id: 10,
    number: 'NMB0000010',
    districtId: 4,
    clientId: 3,
  },
  STATION_11: {
    id: 11,
    number: 'NMB0000011',
    districtId: 5,
    clientId: 4,
  },
  STATION_12: {
    id: 12,
    number: 'NMB0000012',
    districtId: 5,
    clientId: 4,
  },
};
