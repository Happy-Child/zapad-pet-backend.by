import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { ClientsToStationWorkersEntity } from '../entities';

@EntityRepository(ClientsToStationWorkersEntity)
export class ClientsToStationWorkersRepository extends GeneralRepository<ClientsToStationWorkersEntity> {
  protected entitySerializer = ClientsToStationWorkersEntity;
}
