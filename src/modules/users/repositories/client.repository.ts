import { Client } from 'src/modules/clients';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {}
