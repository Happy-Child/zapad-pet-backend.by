import { Injectable } from '@nestjs/common';
import { ClientsCreateBodyDTO } from '../dtos';
import { ClientsRepository } from '../repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { CLIENTS_ERRORS } from '../constants';

@Injectable()
export class ClientsCreateService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async create(body: ClientsCreateBodyDTO): Promise<void> {
    await this.checkExistByNameClientOrFail(body.name);
    await this.clientsRepository.saveEntity(body);
  }

  private async checkExistByNameClientOrFail(name: string): Promise<void> {
    const client = await this.clientsRepository.getOne({ name });
    if (client) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.NAME,
          messages: [CLIENTS_ERRORS.CLIENT_NAME_IS_ALREADY_EXIST],
        },
      ]);
    }
  }
}
