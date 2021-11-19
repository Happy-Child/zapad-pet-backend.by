import {
  Controller,
  Post,
  Body,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() body: StationsCreateRequestBodyDTO): Promise<true> {
    await this.stationsCreateService.execute(body);
    return true;
  }

  @HttpCode(HttpStatus.CREATED)
  @Put()
  async update(@Body() body: StationsUpdateRequestBodyDTO): Promise<true> {
    await this.stationsUpdateService.execute(body);
    return true;
  }
}
