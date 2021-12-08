import { Injectable } from '@nestjs/common';
import { TJwtPayloadDTO } from '../../../auth/types';

@Injectable()
export class BidsGettingListService {
  public async getListByPagination(user: TJwtPayloadDTO): Promise<void> {
    // TODO strategy for every role?
  }
}
