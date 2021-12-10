import { Injectable, PipeTransform } from '@nestjs/common';
import { ExceptionsAppValidationPipe } from '@app/exceptions/pipes';
import { TJwtPayloadDTO } from '../../auth/types';
import { USER_ROLES } from '@app/constants';
import {
  GetListBidsDistrictLeaderQueryDTO,
  GetListBidsEngineerQueryDTO,
  GetListBidsGeneralQueryDTO,
  GetListBidsMasterQueryDTO,
  GetListBidsStationWorkerQueryDTO,
} from '../dtos';
import { SET_USER_METADATA_KEY } from '@app/guards/guards.constants';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BidsGettingListValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (!value) {
      return value;
    }

    let metatype = GetListBidsGeneralQueryDTO;
    const user: TJwtPayloadDTO = Reflect.getMetadata(
      SET_USER_METADATA_KEY,
      value,
    );

    if (user) {
      switch (user.role) {
        case USER_ROLES.STATION_WORKER:
          metatype = GetListBidsStationWorkerQueryDTO;
          break;
        case USER_ROLES.MASTER:
          metatype = GetListBidsMasterQueryDTO;
          break;
        case USER_ROLES.ENGINEER:
          metatype = GetListBidsEngineerQueryDTO;
          break;
        case USER_ROLES.DISTRICT_LEADER:
          metatype = GetListBidsDistrictLeaderQueryDTO;
          break;
      }
    }

    await ExceptionsAppValidationPipe.executeValidation(metatype, value);

    return plainToClass(metatype, value);
  }
}
