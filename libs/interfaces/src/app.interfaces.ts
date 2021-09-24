import { IAuthJwtPayload } from '../../../src/modules/auth/interfaces';

export interface IAppRequest {
  user: IAuthJwtPayload;
}
