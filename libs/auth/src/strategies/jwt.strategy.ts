import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { Unauthorized } from '@app/exceptions';
import { JwtPayloadDTO } from '@app/auth/dtos/jwt-strategy.dtos';
import { COOKIE } from '@app/auth/constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req) {
            if (req.cookies && req.cookies[COOKIE.ACCESS_TOKEN]) {
              return req.cookies[COOKIE.ACCESS_TOKEN];
            }

            const tokenHeaderRaw = req.header(COOKIE.ACCESS_TOKEN);
            if (tokenHeaderRaw) {
              return tokenHeaderRaw.replace('Bearer ', '');
            }
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: readFile(RSA.PUBLIC_KEY_PATH),
      algorithms: [JWT.ALGORITHM],
    });
  }

  public async validate(payload: any): Promise<JwtPayloadDTO> {
    const user = await this.userRepository.findOne({
      where: { id: payload?.sub },
    });

    if (!user) {
      throw new Unauthorized();
    }

    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
