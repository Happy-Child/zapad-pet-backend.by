import { Controller, Post, Body } from '@nestjs/common';
import { StationsCreateRequestBodyDTO } from '../dtos';
import { StationsCreateService } from '../services';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsCreateService: StationsCreateService) {}

  @Post()
  async create(@Body() body: StationsCreateRequestBodyDTO): Promise<true> {
    await this.stationsCreateService.create(body);
    return true;
  }
}
