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

export enum USER_ROLES {
  MASTER = '1',
  STATION_WORKER = '2',
  DISTRICT_LEADER = '3',
  ENGINEER = '4',
  ACCOUNTANT = '5',
}

export enum NODE_INSTANCE {
  TEST = 'test',
}
