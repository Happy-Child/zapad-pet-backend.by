import { Injectable } from '@nestjs/common';
import { UsersUpdateRequestBodyDTO } from '../../dtos/users-update.dtos';

@Injectable()
export class UsersUpdateService {
  public async execute({ users }: UsersUpdateRequestBodyDTO): Promise<void> {
    //
  }
}
