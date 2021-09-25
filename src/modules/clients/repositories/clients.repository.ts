import { EntityRepository } from 'typeorm';
import { ClientEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(ClientEntity)
export class ClientsRepository extends GeneralRepository<ClientEntity> {
  protected entitySerializer = ClientEntity;
}
