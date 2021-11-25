import { Injectable } from '@nestjs/common';
import { TFullMemberDTO, TMemberDTO, TUserDTO } from '../../users/types';
import { isFullMember } from '../../users/helpers';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../constants';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class AuthGeneralService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async me(id: number): Promise<TUserDTO> {
    return this.entityFinderGeneralService.getFullUserOrFail({ id });
  }

  public static isFullMemberOrFail(
    member: TMemberDTO,
  ): member is TFullMemberDTO {
    if (isFullMember(member)) return true;

    throw new ExceptionsForbidden([
      {
        field: ENTITIES_FIELDS.UNKNOWN,
        messages: [AUTH_ERRORS.MEMBER_IS_NOT_FULL],
      },
    ]);
  }
}
