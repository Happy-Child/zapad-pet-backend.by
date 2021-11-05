import { StationEntity } from '@app/entities';

// 12 entities
// clientId=1 - 2,3,4
// clientId=2 - 1,5,6,7
// clientId=3 - 8,9,10
// clientId=4 - 11,12
const data: Partial<StationEntity>[] = [
  {
    number: 'NMB0000001',
    districtId: 1,
    clientId: 2,
  },
  {
    number: 'NMB0000002',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB0000003',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB0000004',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB0000005',
    districtId: 2,
    clientId: 2,
  },
  {
    number: 'NMB0000006',
    districtId: 3,
    clientId: 2,
  },
  {
    number: 'NMB0000007',
    districtId: 3,
    clientId: 2,
  },
  {
    number: 'NMB0000008',
    districtId: 3,
    clientId: 3,
  },
  {
    number: 'NMB0000009',
    districtId: 3,
    clientId: 3,
  },
  {
    number: 'NMB0000010',
    districtId: 4,
    clientId: 3,
  },
  {
    number: 'NMB0000011',
    districtId: 5,
    clientId: 4,
  },
  {
    number: 'NMB0000012',
    districtId: 5,
    clientId: 4,
  },
];

export default data;
