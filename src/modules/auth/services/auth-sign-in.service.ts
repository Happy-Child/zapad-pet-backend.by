import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../constants';
import { comparePasswords } from '../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { UsersRepository } from '../../users/repositories';
import { TMember } from '../../users/types';
import { USER_EXPOSE_GROUPS, USER_ROLES } from '../../users/constants';
import { isNull } from '@app/helpers';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const member = await this.usersRepository.getMemberOrFail(
      {
        email: body.email,
      },
      { groups: [USER_EXPOSE_GROUPS.PASSWORD] },
    );

    await AuthSignInService.checkComparePasswordsOrFail(
      body.password,
      member.password as string,
    );
    AuthSignInService.checkEmailConfirmedOrFail(member.emailConfirmed);
    AuthSignInService.checkFullMemberOrFail(member);

    const payload = {};
    const accessToken = this.jwtService.sign(payload);

    return { user: this.usersRepository.serialize(member), accessToken };
  }

  public static checkEmailConfirmedOrFail(emailConfirmed: boolean): void {
    if (!emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED],
        },
      ]);
    }
  }

  private static async checkComparePasswordsOrFail(
    password: string,
    curPassword: string,
  ): Promise<void> {
    const passwordIsCompare = await comparePasswords(password, curPassword);
    if (passwordIsCompare) return;

    throw new ExceptionsUnprocessableEntity([
      {
        field: ENTITIES_FIELDS.PASSWORD,
        messages: [AUTH_ERRORS.INVALID_PASSWORD],
      },
    ]);
  }

  private static checkFullMemberOrFail(member: TMember): void {
    if (AuthSignInService.isFullMemberByFields(member)) return;

    throw new ExceptionsUnprocessableEntity([
      {
        field: ENTITIES_FIELDS.UNKNOWN,
        messages: [AUTH_ERRORS.MEMBER_IS_NOT_FULL],
      },
    ]);
  }

  private static isFullMemberByFields(member: TMember): boolean {
    switch (member.role) {
      case USER_ROLES.STATION_WORKER:
        return !isNull(member.clientId) || !isNull(member.stationId);
      case USER_ROLES.DISTRICT_LEADER:
        return !isNull(member.leaderDistrictId);
      case USER_ROLES.ENGINEER:
        return !isNull(member.engineerDistrictId);
      default:
        return true;
    }
  }
}
