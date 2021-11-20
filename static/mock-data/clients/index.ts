import { ClientEntity } from '@app/entities';
import { MOCK_CLIENTS_MAP } from './clients.mock';

const data: Partial<ClientEntity>[] = Object.values(MOCK_CLIENTS_MAP);

export default data;
