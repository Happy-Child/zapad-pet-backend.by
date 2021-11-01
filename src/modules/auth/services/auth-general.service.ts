import { Injectable } from '@nestjs/common';
import { TFullMemberDTO, TMemberDTO } from '../../users/types';
import { SimpleUserDTO } from '../../users/dtos';
import { UsersGettingService } from '../../users/services';
import { isFullMember } from '../../users/helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../constants';

@Injectable()
export class AuthGeneralService {
  constructor(private readonly usersGettingService: UsersGettingService) {}

  public async me(id: number): Promise<TMemberDTO | SimpleUserDTO> {
    return this.usersGettingService.getFullUserOrFail({ id });
  }

  public static isFullMemberOrFail(
    member: TMemberDTO,
  ): member is TFullMemberDTO {
    if (isFullMember(member)) return true;

    throw new ExceptionsUnprocessableEntity([
      {
        field: ENTITIES_FIELDS.UNKNOWN,
        messages: [AUTH_ERRORS.MEMBER_IS_NOT_FULL],
      },
    ]);
  }
}
