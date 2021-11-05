import { Controller, Post, Body, Put } from '@nestjs/common';
import {
  StationsCreateRequestBodyDTO,
  StationsUpdateRequestBodyDTO,
} from '../dtos';
import { StationsCreateService, StationsUpdateService } from '../services';

@Controller('stations')
export class StationsController {
  constructor(
    private readonly stationsCreateService: StationsCreateService,
    private readonly stationsUpdateService: StationsUpdateService,
  ) {}

  @Post()
  async create(@Body() body: StationsCreateRequestBodyDTO): Promise<true> {
    await this.stationsCreateService.execute(body);
    return true;
  }

  @Put()
  async update(@Body() body: StationsUpdateRequestBodyDTO): Promise<true> {
    await this.stationsUpdateService.execute(body);
    return true;
  }
}
