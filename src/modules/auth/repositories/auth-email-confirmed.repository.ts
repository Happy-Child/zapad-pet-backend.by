import { EntityRepository } from 'typeorm';
import { EmailConfirmedEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(EmailConfirmedEntity)
export class AuthEmailConfirmedRepository extends GeneralRepository<EmailConfirmedEntity> {
  protected entitySerializer = EmailConfirmedEntity;
}
