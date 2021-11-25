import { EntityRepository } from 'typeorm';
import { EngineerEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(EngineerEntity)
export class EngineersRepository extends GeneralRepository<EngineerEntity> {
  protected entitySerializer = EngineerEntity;
}
