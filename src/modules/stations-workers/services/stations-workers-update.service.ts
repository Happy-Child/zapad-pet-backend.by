import { Injectable } from '@nestjs/common';
import { StationsWorkersRepository } from '../repositories';

@Injectable()
export class StationsWorkersUpdateService {
  constructor(
    private readonly stationsWorkersRepository: StationsWorkersRepository,
  ) {}
}
