import { EntityRepository } from 'typeorm';
import { ClientEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';
import {
  ClientDTO,
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { CLIENTS_DEFAULT_SORT_BY } from '../constants';
import { ENTITIES_FIELDS, SORT_DURATION_DEFAULT } from '@app/constants';
import { StationEntity } from '../../stations';

@EntityRepository(ClientEntity)
export class ClientsRepository extends GeneralRepository<ClientEntity> {
  protected entitySerializer = ClientEntity;

  public async getClientById(id: number): Promise<ClientDTO | undefined> {
    const client = await this.createQueryBuilder('cl')
      .where(`cl.id = ${id}`)
      .loadRelationCountAndMap(
        `cl.${ENTITIES_FIELDS.STATIONS_COUNT}`,
        'cl.stations',
      )
      .getOne();

    return client as ClientDTO;
  }

  // TODO replace join on relationAndCount? If use relationAndCount - orderBy "stationsCount" not working
  // leftJoinAndSelect(cl.stations, 'clsts');
  public async getClientsWithPagination(
    data: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    const query = await this.createQueryBuilder('cl').select(
      `cl.*, COUNT(st.clientId)::int AS "${ENTITIES_FIELDS.STATIONS_COUNT}"`,
    );

    if (data.searchByName) {
      query.where(`name LIKE '%${data.searchByName}%'`);
    }

    const items = await query
      .leftJoin(StationEntity, 'st', '"st"."clientId" = cl.id')
      .groupBy('cl.id')
      .orderBy(
        `"${data.sortBy || CLIENTS_DEFAULT_SORT_BY}"`,
        data.sortDuration || SORT_DURATION_DEFAULT,
      )
      .offset(data.skip || 0)
      .limit(data.take)
      .getRawMany<ClientDTO>();

    const totalItemsCount = await this.count();

    return {
      totalItemsCount,
      items,
    };
  }
}
