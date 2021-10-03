import { Injectable } from '@nestjs/common';
import {
  ClientDTO,
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { ClientsRepository } from '../repositories';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { AUTH_ERRORS } from '../../auth/constants';

@Injectable()
export class ClientsGettingService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  public async getList(
    query: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    const result = await this.clientsRepository.getClientsWithPagination(query);
    return new ClientsGettingResponseBodyDTO(result);
  }

  public async getByIdOrFail(id: number): Promise<ClientDTO> {
    const client = await this.clientsRepository.getClientById(id);

    if (!client) {
      throw new ExceptionsNotFound([
        { field: ENTITIES_FIELDS.ID, messages: [AUTH_ERRORS.CLIENT_NOT_EXIST] },
      ]);
    }

    return new ClientDTO(client);
  }
}
