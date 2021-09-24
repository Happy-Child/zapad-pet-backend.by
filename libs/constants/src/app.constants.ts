import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';

export enum APP_CONTEXT {
  HTTP = 'http',
  WS = 'ws',
  RPC = 'rpc',
}

export const DEFAULT_APP_API_PORT = 3001;

export const APP_VALIDATION_PIPE_OPTIONS = {
  whitelist: true,
};

export const APP_SERIALIZER_OPTIONS: ClassTransformOptions = {
  strategy: 'excludeAll',
};
