import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SET_USER_METADATA_TYPE } from '@app/guards/guards.constants';
import { SetUserMetadataGuard } from '@app/guards/guards/set-user-metadata.guard';
import { AuthGuard } from '@nestjs/passport';

export function SetUserToRequestField(setToField: SET_USER_METADATA_TYPE) {
  return applyDecorators(
    SetMetadata('setToField', setToField),
    UseGuards(AuthGuard('jwt'), SetUserMetadataGuard),
  );
}
