import { Injectable } from '@nestjs/common';
import { EmailConfirmationRequestBodyDTO } from '@app/auth/dtos/email-confirmation.dtos';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';
import { UserRepository } from '@app/auth/repositories/user.repository';

@Injectable()
export class EmailConfirmedService {
  constructor(
    private readonly emailConfirmedRepository: EmailConfirmedRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const emailConfirmationData = await this.emailConfirmedRepository.findOne({
      token: body.token,
    });
    if (!emailConfirmationData) {
      throw new UnprocessableEntity([
        { field: 'token', message: AUTH_ERRORS.TOKEN_NOT_FOUND },
      ]);
    }

    const user = await this.userRepository.findByEmail(
      emailConfirmationData.email,
    );
    if (!user) {
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.USER_NOT_FOUND },
      ]);
    }
    if (user.emailConfirmed) {
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.EMAIL_IS_ALREADY_CONFIRMED },
      ]);
    }

    await this.emailConfirmedRepository.delete({
      id: emailConfirmationData.id,
    });
    await this.userRepository.save({ ...user, emailConfirmed: true });
  }
}
