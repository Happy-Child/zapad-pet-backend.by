import { Injectable } from '@nestjs/common';
import {
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { ClientsRepository } from '../repositories';
import { Like } from 'typeorm';
import { CLIENTS_DEFAULT_SORT_BY } from '../constants';
import { SORT_DURATION_DEFAULT } from '@app/constants';

@Injectable()
export class ClientsGettingService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  public async getList(
    query: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    const where = query.searchByName
      ? { name: Like(`%${query.searchByName}%`) }
      : undefined;
    const order = {
      [query.sortBy || CLIENTS_DEFAULT_SORT_BY]:
        query.sortDuration || SORT_DURATION_DEFAULT,
    };

    const result = await this.clientsRepository.getPagination({
      skip: query.skip || 0,
      take: query.take,
      order,
      where,
    });

    return new ClientsGettingResponseBodyDTO(result);
  }
}
