import { Controller, Post, Body } from '@nestjs/common';
import { ClientsCreateBodyDTO } from '../dtos';
import { ClientsCreateService } from '../services';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsCreateService: ClientsCreateService) {}

  @Post()
  async create(@Body() body: ClientsCreateBodyDTO): Promise<true> {
    await this.clientsCreateService.create(body);
    return true;
  }
}
