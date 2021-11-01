import { EntityRepository } from 'typeorm';
import { PasswordRecoveryEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(PasswordRecoveryEntity)
export class AuthPasswordRecoveryRepository extends GeneralRepository<PasswordRecoveryEntity> {
  protected entitySerializer = PasswordRecoveryEntity;
}
