import { EntityRepository } from 'typeorm';
import { EngineerEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(EngineerEntity)
export class UsersEngineersRepository extends GeneralRepository<EngineerEntity> {
  protected entitySerializer = EngineerEntity;
}
