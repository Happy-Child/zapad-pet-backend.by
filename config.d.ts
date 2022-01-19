declare module 'config' {
  import { Algorithm } from 'jsonwebtoken';
  import { ENVIRONMENTS } from '@app/constants';

  export const CORS: boolean;

  export const NODE_ENV: ENVIRONMENTS;

  export const APPS: {
    API: {
      PORT: number;
      PREFIX: string;
    };
    OPEN_API: {
      PREFIX: string;
    };
  };

  export const POSTGRES: {
    readonly HOST: string;
    readonly USERNAME: string;
    readonly PASSWORD: string;
    readonly PORT: number;
    readonly DB: string;
    readonly RETRY_ATTEMPTS: number;
    readonly RETRY_DELAY: number;
    readonly SSL: boolean;
  };

  export const MAIL_SENDER: {
    readonly FROM: string;
    readonly HOST: string;
    readonly PORT: number;
    readonly SECURE: boolean;
    readonly USER: string;
    readonly PASS: string;
  };

  export const FRONT_URLS: {
    CONFIRM_EMAIL: string;
    CREATE_NEW_PASSWORD: string;
  };

  export const COOKIES_OPTIONS: {
    readonly SECURE: boolean;
    readonly SAME_SITE: boolean | 'lax' | 'strict' | 'none';
  };

  export const JWT: {
    readonly ALGORITHM: Algorithm;
    readonly EXPIRATION: string;
    readonly SECRET_KEY: string;
  };

  export const RSA: {
    readonly PRIVATE_KEY_PATH: string;
    readonly PUBLIC_KEY_PATH: string;
  };

  export const FILE_STORAGE: {
    LOCAL_STORAGE_PATH: string;
  };
}
