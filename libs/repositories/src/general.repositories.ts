import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  RepositoryFindConditions,
  RepositorySerializeOptions,
  RepositorySaveEntityOptions,
  RepositoryUpdateEntityInputs,
  RepositorySaveEntity,
  RepositoryCreateEntity,
  RepositoryDeleteOneConditions,
  RepositoryDeleteByIdsConditions,
} from '@app/repositories/types';
import {
  IGetOneOptions,
  IGetOneOrFailOptions,
  IUpdateEntitiesItem,
} from '@app/repositories/interfaces';
import { DEFAULT_REPOSITORY_SERIALISE_OPTIONS } from '@app/repositories/constants';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { BaseEntity } from '@app/entities';

export class GeneralRepository<E extends BaseEntity> extends Repository<E> {
  protected readonly defaultSerializeOptions: RepositorySerializeOptions =
    DEFAULT_REPOSITORY_SERIALISE_OPTIONS;

  protected entitySerializer = BaseEntity;

  public async getOne(
    conditions: RepositoryFindConditions<E>,
    { repository, serialize }: IGetOneOptions<E> = {},
  ): Promise<E | null> {
    const item = await this.findOne(conditions, repository);
    return item ? this.serialize(item, serialize) : null;
  }

  public async getOneOrFail(
    conditions: RepositoryFindConditions<E>,
    { repository, serialize, exception }: IGetOneOrFailOptions<E> = {},
  ) {
    const entity = await this.getOne(conditions, { repository, serialize });

    if (!entity) {
      const finalException = exception?.type || ExceptionsBadRequest;
      throw new finalException(exception?.messages);
    }

    return entity;
  }

  public createEntity(data: RepositoryCreateEntity<E>): E {
    return this.create(data);
  }

  public createEntities(data: RepositoryCreateEntity<E>[]): E[] {
    return this.create(data);
  }

  public async updateEntity(
    criteria: RepositoryFindConditions<E>,
    inputs: RepositoryUpdateEntityInputs<E>,
  ): Promise<void> {
    await this.update(criteria, inputs);
  }

  public async updateEntities(items: IUpdateEntitiesItem<E>[]): Promise<void> {
    const updates = items.map(({ criteria, inputs }) =>
      this.update(criteria, inputs),
    );
    await Promise.all(updates);
  }

  public async saveEntity(
    entity: RepositorySaveEntity<E>,
    options?: RepositorySaveEntityOptions,
  ): Promise<E> {
    return this.save(entity, options);
  }

  public async saveEntities(
    entity: RepositorySaveEntity<E>[],
    options?: RepositorySaveEntityOptions,
  ): Promise<E[]> {
    return this.save(entity, options);
  }

  public async deleteEntity(
    conditions: RepositoryDeleteOneConditions<E>,
  ): Promise<void> {
    await this.delete(conditions);
  }

  public async deleteEntitiesByIds(
    conditions: RepositoryDeleteByIdsConditions,
  ): Promise<void> {
    await this.delete(conditions);
  }

  public serialize(entity: E, options?: RepositorySerializeOptions): E {
    const concatOptions = {
      ...this.defaultSerializeOptions,
      ...(options || null),
    };

    return plainToClass(this.entitySerializer, entity, concatOptions) as E;
  }

  public serializeMany(
    entities: E[],
    options?: RepositorySerializeOptions,
  ): E[] {
    return entities.map((entity) => this.serialize(entity, options));
  }
}
