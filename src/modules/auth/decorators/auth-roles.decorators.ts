import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { USER_ROLES } from '../../users/constants';
import { AuthGuard } from '@nestjs/passport';
import { AuthRolesGuard } from '../guards/auth-roles.guard';

export function AuthRoles(...roles: USER_ROLES[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), AuthRolesGuard),
  );
}
