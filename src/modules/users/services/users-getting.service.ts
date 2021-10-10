import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersGettingService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getList(data: any): Promise<any> {
    return [];
  }
}
