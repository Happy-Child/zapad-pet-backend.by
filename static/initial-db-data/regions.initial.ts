import { RegionEntity } from '@app/entities';

export const INITIAL_REGIONS_DATA_MAP: Record<string, Partial<RegionEntity>> = {
  REGION_1: {
    id: 1,
    slug: 'brestskaia-voblasts',
    name: 'Брестская',
  },
  REGION_2: {
    id: 2,
    slug: 'vitsebskaia-voblasts',
    name: 'Витебская',
  },
  REGION_3: {
    id: 3,
    slug: 'homelskaia-voblasts',
    name: 'Гомельская',
  },
  REGION_4: {
    id: 4,
    slug: 'hrodnenskaia-voblasts',
    name: 'Гродненская',
  },
  REGION_5: {
    id: 5,
    slug: 'minskaia-voblasts',
    name: 'Минская',
  },
  REGION_6: {
    id: 6,
    slug: 'mahiliouskaia-voblasts',
    name: 'Могилёвская',
  },
};
