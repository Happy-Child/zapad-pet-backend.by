import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { getItemsByUniqueField } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../../../auth/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ClientsRepository } from '../../repositories';
import { CLIENTS_ERRORS } from '../../constants';

@Injectable()
export class ClientsGeneralCheckingService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  public async allClientsExistsOrFail(
    items: NonEmptyArray<{ clientId: number; index: number }>,
  ): Promise<void> {
    const uniqueIds = getItemsByUniqueField<{ clientId: number }>(
      'clientId',
      items,
    );

    const foundEntities = await this.clientsRepository.getManyByColumn(
      uniqueIds,
    );
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return;

    const foundEntitiesIds = foundEntities.map(({ id }) => id);
    const result = items.filter(
      (item) => !foundEntitiesIds.includes(item.clientId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: ENTITIES_FIELDS.CLIENT_ID,
      messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

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
