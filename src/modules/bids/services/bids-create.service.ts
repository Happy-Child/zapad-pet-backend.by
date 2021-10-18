import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { BidsCreateBodyDTO } from '../dtos';
import { Connection } from 'typeorm';
import { BidsTodosRepository } from '../repositories';

@Injectable()
export class BidsCreateService {
  constructor(private readonly connection: Connection) {}

  async create(body: BidsCreateBodyDTO, stationId: number): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const bidsRepository = manager.getCustomRepository(BidsRepository);
      const createdBid = await bidsRepository.saveEntity({
        ...body,
        stationId,
      });

      const bidsTodosRepository =
        manager.getCustomRepository(BidsTodosRepository);
      await bidsTodosRepository.saveEntities(
        body.todos.map((todo) => ({
          ...todo,
          bidId: createdBid.id,
        })),
      );
    });
  }
}
