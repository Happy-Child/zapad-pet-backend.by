import { EntityRepository, Repository } from 'typeorm';
import { EmailConfirmed } from '@app/entities';

@EntityRepository(EmailConfirmed)
export class EmailConfirmedRepository extends Repository<EmailConfirmed> {}
