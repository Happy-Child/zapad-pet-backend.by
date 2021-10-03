import { Injectable } from '@nestjs/common';
import { ClientsCreateBodyDTO } from '../dtos';
import { ClientsRepository } from '../repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { CLIENTS_ERRORS } from '../constants';
import { ClientsUpdateBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../../auth/constants';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async create(body: ClientsCreateBodyDTO): Promise<void> {
    await this.checkExistingClientName(body.name);
    await this.clientsRepository.saveEntity(body);
  }

  async update(id: number, body: ClientsUpdateBodyDTO): Promise<void> {
    await this.clientsRepository.getOneOrFail(
      { id },
      {
        exception: {
          type: ExceptionsUnprocessableEntity,
          messages: [
            {
              field: ENTITIES_FIELDS.ID,
              messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
            },
          ],
        },
      },
    );

    if (body.name) {
      await this.checkExistingClientName(body.name);
      await this.clientsRepository.updateEntity({ id }, body);
    }
  }

  public async deleteById(id: number): Promise<void> {
    console.log('deleteById', id);
    return;
    // check bids statuses (example method name allowRemoveAllClientStations)
    // if of - remove stations
    // if of - remove stations workers
  }

  private async checkExistingClientName(name: string): Promise<void> {
    await this.clientsRepository.getOneAndFail(
      { name },
      {
        exception: {
          type: ExceptionsUnprocessableEntity,
          messages: [
            {
              field: ENTITIES_FIELDS.NAME,
              messages: [CLIENTS_ERRORS.CLIENT_NAME_IS_ALREADY_EXIST],
            },
          ],
        },
      },
    );
  }
}
