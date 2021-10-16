import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { EmailConfirmedEntity } from '@app/entities';

@EntityRepository(EmailConfirmedEntity)
export class UsersEmailConfirmedRepository extends GeneralRepository<EmailConfirmedEntity> {
  protected entitySerializer = EmailConfirmedEntity;
}
