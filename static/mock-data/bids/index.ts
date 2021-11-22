import { BidEntity, BidTodoEntity } from '@app/entities';
import { MOCK_BIDS_MAP } from './bids.mock';

const data: (Omit<Partial<BidEntity>, 'todos'> & {
  todos: Partial<BidTodoEntity>[];
})[] = Object.values(MOCK_BIDS_MAP);

export default data;
