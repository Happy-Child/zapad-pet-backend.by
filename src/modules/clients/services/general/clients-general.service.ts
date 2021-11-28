import { Injectable } from '@nestjs/common';
import { ENTITIES_FIELDS } from '@app/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ClientsRepository } from '../../repositories';
import { CLIENTS_ERRORS } from '@app/constants';

@Injectable()
export class ClientsGeneralService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  public async clientNameNotExistsOrFail(name: string): Promise<void> {
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
