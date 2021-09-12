import { EntityRepository, Repository } from 'typeorm';
import { Client } from '@app/entities';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {}
