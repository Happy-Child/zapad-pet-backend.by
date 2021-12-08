import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRolesGuard } from '@app/guards/guards/auth-roles.guard';
import { USER_ROLES } from '@app/constants';

export function AuthRoles(...roles: USER_ROLES[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), AuthRolesGuard),
  );
}
