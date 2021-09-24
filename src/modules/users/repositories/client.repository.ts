import { EntityRepository, Repository } from 'typeorm';
import { Client } from '../../clients';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {}
