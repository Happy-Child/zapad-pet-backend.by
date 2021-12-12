import { Injectable } from '@nestjs/common';
import { ClientsRepository } from '../repositories';
import { ClientsGeneralService } from './general';
import { ClientCreateBodyDTO } from '../dtos';

@Injectable()
export class ClientsCreateService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly clientsGeneralService: ClientsGeneralService,
  ) {}

  async create(body: ClientCreateBodyDTO): Promise<void> {
    await this.clientsGeneralService.clientNameNotExistsOrFail(body.name);
    await this.clientsRepository.saveEntity(body);
  }
}
