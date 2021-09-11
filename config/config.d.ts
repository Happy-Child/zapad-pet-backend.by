declare module 'config' {
  export const APPS: {
    API: {
      PORT: number;
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
    CONFIRMED_REGISTRATION: string;
  };
}
