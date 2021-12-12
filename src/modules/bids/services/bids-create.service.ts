import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { BidsCreateBodyDTO } from '../dtos';
import { Connection } from 'typeorm';
import { BidsTodosRepository } from '../repositories';
import { getBidTodosToFirstSave } from '../helpers/bids-todos.helpers';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { ENTITIES_FIELDS } from '@app/constants';

@Injectable()
export class BidsCreateService {
  constructor(
    private readonly connection: Connection,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  async create(body: BidsCreateBodyDTO, stationId: number): Promise<void> {
    if (body.imageFileId) {
      await this.entityFinderGeneralService.getFileStorageOrFail(
        body.imageFileId,
        ENTITIES_FIELDS.IMAGE_FILE_ID,
      );
    }

    await this.connection.transaction(async (manager) => {
      const bidsRepository = manager.getCustomRepository(BidsRepository);
      const createdBid = await bidsRepository.saveEntity({
        ...body,
        stationId,
      });

      const bidsTodosRepository =
        manager.getCustomRepository(BidsTodosRepository);

      await bidsTodosRepository.saveEntities(
        getBidTodosToFirstSave(body.todos).map((todo) => ({
          ...todo,
          bidId: createdBid.id,
        })),
      );
    });
  }
}
