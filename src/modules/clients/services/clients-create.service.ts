import { Injectable } from '@nestjs/common';
import { ClientsRepository } from '../repositories';
import { ClientEntity } from '@app/entities';
import { ClientsGeneralCheckingService } from './general';

@Injectable()
export class ClientsCreateService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly clientsGeneralCheckingService: ClientsGeneralCheckingService,
  ) {}

  async create(body: ClientEntity): Promise<void> {
    await this.clientsGeneralCheckingService.clientNameNotExistsOrFail(
      body.name,
    );
    await this.clientsRepository.saveEntity(body);
  }
}
