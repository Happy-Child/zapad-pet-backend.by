import { Injectable } from '@nestjs/common';
import { TJwtPayloadDTO } from '../../../auth/types';
import { TGetListBidsQueryDTO } from '../../dtos';

@Injectable()
export class BidsGettingListService {
  public async getListByPagination(
    query: TGetListBidsQueryDTO,
    user: TJwtPayloadDTO,
  ): Promise<void> {
    // TODO strategy for every role?
  }
}
