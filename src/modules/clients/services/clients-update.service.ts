import { Injectable } from '@nestjs/common';
import { ClientsRepository } from '../repositories';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { ClientsUpdateBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '@app/constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { ClientsGeneralService } from './general';

@Injectable()
export class ClientsUpdateService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly clientsGeneralService: ClientsGeneralService,
  ) {}

  async update(id: number, body: ClientsUpdateBodyDTO): Promise<void> {
    await this.clientsRepository.getOneOrFail(
      { id },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: ENTITIES_FIELDS.ID,
              messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
            },
          ],
        },
      },
    );

    await this.clientsGeneralService.clientNameNotExistsOrFail(body.name);
    await this.clientsRepository.updateEntity({ id }, body);
  }
}
