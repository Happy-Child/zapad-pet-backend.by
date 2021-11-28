import { BidEntity } from '@app/entities';
import { BidsCountByStatusesDTO } from '../../../src/modules/bids/dtos/bids-general.dtos';
import { plainToClass } from 'class-transformer';

export const getAggrBidsCountByStatuses = (
  bids: BidEntity[] | null | undefined,
): BidsCountByStatusesDTO => {
  const dto = plainToClass(BidsCountByStatusesDTO, {});
  const result = Object.keys(dto).reduce(
    (map, key) => ({
      ...map,
      [key]: 0,
    }),
    dto,
  );

  if (!bids) return result;

  bids.forEach(({ status }) => result[status]++);

  return result;
};
