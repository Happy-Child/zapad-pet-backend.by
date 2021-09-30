import { EntityRepository } from 'typeorm';
import { ClientEntity } from '../../clients';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(ClientEntity)
export class UsersClientsRepository extends GeneralRepository<ClientEntity> {
  protected entitySerializer = ClientEntity;
}
