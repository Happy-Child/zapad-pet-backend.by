import { Injectable } from '@nestjs/common';
import { ClientsRepository } from '../repositories';
import { ClientEntity } from '@app/entities';
import { ClientsGeneralService } from './general';

@Injectable()
export class ClientsCreateService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly clientsGeneralService: ClientsGeneralService,
  ) {}

  async create(body: ClientEntity): Promise<void> {
    await this.clientsGeneralService.clientNameNotExistsOrFail(body.name);
    await this.clientsRepository.saveEntity(body);
  }
}
