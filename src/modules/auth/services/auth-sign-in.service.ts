import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../constants';
import { comparePasswords } from '../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { UsersRepository } from '../../users/repositories';
import { TFullMemberDTO, TMemberDTO } from '../../users/types';
import { USER_EXPOSE_GROUPS } from '../../users/constants';
import { isFullMember, isMember } from '../../users/helpers';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.usersRepository.getUserOrFail(
      {
        email: body.email,
      },
      { groups: [USER_EXPOSE_GROUPS.PASSWORD] },
    );

    await AuthSignInService.checkComparePasswordsOrFail(
      body.password,
      user.password as string,
    );
    AuthSignInService.checkEmailConfirmedOrFail(user.emailConfirmed);
    if (isMember(user)) AuthSignInService.isFullMemberOrFail(user);

    const accessToken = this.jwtService.sign({ sub: user.id });
    return plainToClass(SignInResponseBodyDTO, { user, accessToken });
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
}
