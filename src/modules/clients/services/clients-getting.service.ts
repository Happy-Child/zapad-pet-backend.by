import { Injectable } from '@nestjs/common';
import {
  ClientExtendedDTO,
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { ClientsRepository } from '../repositories';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/constants';

@Injectable()
export class ClientsGettingService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  public async getList(
    query: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    const result = await this.clientsRepository.getClientsWithPagination(query);
    return new ClientsGettingResponseBodyDTO(result);
  }

  public async getByIdOrFail(id: number): Promise<ClientExtendedDTO> {
    const client = await this.clientsRepository.getClientById(id);

    if (!client) {
      throw new ExceptionsNotFound([
        { field: ENTITIES_FIELDS.ID, messages: [AUTH_ERRORS.CLIENT_NOT_EXIST] },
      ]);
    }

    return new ClientExtendedDTO(client);
  }
}
