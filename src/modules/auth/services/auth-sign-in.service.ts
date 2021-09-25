import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS, UserEntity } from '@app/entities';
import { AuthUserRepository } from '../repositories';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../constants';
import { comparePasswords } from '../helpers';
import { USER_ROLES } from '../../users/constants';
import {
  DistrictsRepository,
  DistrictsToEngineersRepository,
} from '../../districts';
import { IRepositoryException } from '@app/repositories/interfaces';
import { ClientsToStationWorkersRepository } from '../../clients';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly districtsRepository: DistrictsRepository,
    private readonly districtToEngineersRepository: DistrictsToEngineersRepository,
    private readonly clientToStationWorkersRepository: ClientsToStationWorkersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.authUserRepository.findWithPasswordByEmailOrFail(
      body.email,
    );

    this.checkEmailConfirmedOrFail(user.emailConfirmed);
    await this.checkComparePasswordsOrFail(body.password, user.password);
    await this.isCompleteUserRoleOrFail(user);

    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });

    return { user: this.authUserRepository.serialize(user), accessToken };
  }

  private checkEmailConfirmedOrFail(emailConfirmed: boolean): void {
    if (!emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED],
        },
      ]);
    }
  }

  public async isCompleteUserRoleOrFail(user: UserEntity): Promise<void> {
    if (user.role === USER_ROLES.DISTRICT_LEADER) {
      await this.districtsRepository.getOneOrFail(
        { districtLeaderId: user.id },
        {
          exception: this.getExceptionCheckUserRole(
            AUTH_ERRORS.NO_CONNECTION_WITH_DISTRICT,
          ),
        },
      );
    }
    if (user.role === USER_ROLES.ENGINEER) {
      await this.districtToEngineersRepository.getOneOrFail(
        { engineerId: user.id },
        {
          exception: this.getExceptionCheckUserRole(
            AUTH_ERRORS.NO_CONNECTION_WITH_DISTRICT,
          ),
        },
      );
    }
    if (user.role === USER_ROLES.STATION_WORKER) {
      await this.clientToStationWorkersRepository.getOneOrFail(
        { stationWorkerId: user.id },
        {
          exception: this.getExceptionCheckUserRole(
            AUTH_ERRORS.NO_CONNECTION_WITH_CLIENT,
          ),
        },
      );
    }
  }

  private getExceptionCheckUserRole(message: string): IRepositoryException {
    return {
      type: ExceptionsUnprocessableEntity,
      messages: [
        {
          field: ENTITIES_FIELDS.UNKNOWN,
          messages: [message],
        },
      ],
    };
  }

  private async checkComparePasswordsOrFail(
    password: string,
    curPassword: string,
  ): Promise<void> {
    const passwordIsCompare = await comparePasswords(password, curPassword);
    if (!passwordIsCompare) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.PASSWORD,
          messages: [AUTH_ERRORS.INVALID_PASSWORD],
        },
      ]);
    }
  }
}
