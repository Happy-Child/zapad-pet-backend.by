import { Injectable } from '@nestjs/common';
import { TFullMemberDTO, TMemberDTO, TUserDTO } from '../../users/types';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { ENTITIES_FIELDS, AUTH_ERRORS } from '@app/constants';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { isFullMember } from '../../users/helpers';

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
