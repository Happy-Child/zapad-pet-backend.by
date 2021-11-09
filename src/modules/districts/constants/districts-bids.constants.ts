import { BID_STATUS } from '../../bids/constants';
import { NonEmptyArray } from '@app/types';

export const BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT: NonEmptyArray<BID_STATUS> =
  [BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER];
