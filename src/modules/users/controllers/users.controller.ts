import { Controller, Post, Body } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../dtos/users-create.dtos';
import { UsersCreateService } from '../services/users-create.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersCreateService: UsersCreateService) {}

  @Post()
  create(@Body() body: UsersCreateRequestBodyDTO) {
    return this.usersCreateService.create(body);
  }
}
