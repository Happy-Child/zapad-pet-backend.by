import { StationEntity } from '@app/entities';

// 12 entities
// clientId=1 - 2,3,4
// clientId=2 - 1,5,6,7
// clientId=3 - 8,9,10
// clientId=4 - 11,12
const data: Partial<StationEntity>[] = [
  {
    number: 'NMB000001',
    districtId: 1,
    clientId: 2,
  },
  {
    number: 'NMB000002',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB000003',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB000004',
    districtId: 2,
    clientId: 1,
  },
  {
    number: 'NMB000005',
    districtId: 2,
    clientId: 2,
  },
  {
    number: 'NMB000006',
    districtId: 3,
    clientId: 2,
  },
  {
    number: 'NMB000007',
    districtId: 3,
    clientId: 2,
  },
  {
    number: 'NMB000008',
    districtId: 3,
    clientId: 3,
  },
  {
    number: 'NMB000009',
    districtId: 3,
    clientId: 3,
  },
  {
    number: 'NMB000010',
    districtId: 4,
    clientId: 3,
  },
  {
    number: 'NMB000011',
    districtId: 5,
    clientId: 4,
  },
  {
    number: 'NMB000012',
    districtId: 5,
    clientId: 4,
  },
];

export default data;
