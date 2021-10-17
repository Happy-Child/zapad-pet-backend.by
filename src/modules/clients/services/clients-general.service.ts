import { Injectable } from '@nestjs/common';
import { ClientsRepository } from '../repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { CLIENTS_ERRORS } from '../constants';
import { ClientsUpdateBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { ClientEntity } from '@app/entities';

@Injectable()
export class ClientsGeneralService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async create(body: ClientEntity): Promise<void> {
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
