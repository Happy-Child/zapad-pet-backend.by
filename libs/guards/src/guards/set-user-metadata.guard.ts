import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  SET_USER_METADATA_KEY,
  SET_USER_METADATA_TYPE,
} from '@app/guards/guards.constants';

@Injectable()
export class SetUserMetadataGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const setToField = this.reflector.get<SET_USER_METADATA_TYPE>(
      'setToField',
      context.getHandler(),
    );

    if (!setToField) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (request[setToField]) {
      Reflect.defineMetadata(
        SET_USER_METADATA_KEY,
        request.user,
        request.query,
      );
    }

    return true;
  }
}
