import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserRepository } from '../repositories';
import { UserEntity } from '../../users/entities';
import { AUTH_ERRORS } from '../constants';
import { ENTITIES_FIELDS } from '@app/entities';

@Injectable()
export class AuthGeneralService {
  constructor(private readonly authUserRepository: AuthUserRepository) {}

  public async me(id: number): Promise<UserEntity> {
    return this.authUserRepository.getOneOrFail(
      { id },
      {
        exception: {
          type: UnauthorizedException,
          messages: [
            {
              field: ENTITIES_FIELDS.UNKNOWN,
              messages: [AUTH_ERRORS.USER_NOT_FOUND],
            },
          ],
        },
      },
    );
  }
}
