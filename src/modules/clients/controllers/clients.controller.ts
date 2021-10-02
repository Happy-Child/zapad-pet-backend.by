import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientsCreateBodyDTO } from '../dtos';
import { ClientsService } from '../services';
import { ClientsUpdateBodyDTO } from '../dtos/clients-update.dtos';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() body: ClientsCreateBodyDTO): Promise<true> {
    await this.clientsService.create(body);
    return true;
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ClientsUpdateBodyDTO,
  ): Promise<true> {
    await this.clientsService.update(id, body);
    return true;
  }
}
