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
  RepositoryFindManyOptions,
} from '@app/repositories/types';
import {
  IRepositoryGetOneOptions,
  IRepositoryGetOneOrFailOptions,
  IRepositoryUpdateEntitiesItem,
} from '@app/repositories/interfaces';
import { DEFAULT_REPOSITORY_SERIALISE_OPTIONS } from '@app/repositories/constants';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { BaseEntity } from '@app/entities';
import { PaginationResponseDTO } from '@app/dtos';

export class GeneralRepository<E extends BaseEntity> extends Repository<E> {
  protected readonly defaultSerializeOptions: RepositorySerializeOptions =
    DEFAULT_REPOSITORY_SERIALISE_OPTIONS;

  protected entitySerializer = BaseEntity;

  public async getOne(
    conditions: RepositoryFindConditions<E>,
    { repository, serialize }: IRepositoryGetOneOptions<E> = {},
  ): Promise<E | undefined> {
    const item = await this.findOne(conditions, repository);
    return item ? this.serialize(item, serialize) : undefined;
  }

  public async getOneOrFail(
    conditions: RepositoryFindConditions<E>,
    {
      repository,
      serialize,
      exception,
    }: IRepositoryGetOneOrFailOptions<E> = {},
  ) {
    const entity = await this.getOne(conditions, { repository, serialize });

    if (!entity) {
      const finalException = exception?.type || ExceptionsBadRequest;
      throw new finalException(exception?.messages);
    }

    return entity;
  }

  public async getOneAndFail(
    conditions: RepositoryFindConditions<E>,
    {
      repository,
      serialize,
      exception,
    }: IRepositoryGetOneOrFailOptions<E> = {},
  ) {
    const entity = await this.getOne(conditions, { repository, serialize });

    if (entity) {
      const finalException = exception?.type || ExceptionsBadRequest;
      throw new finalException(exception?.messages);
    }

    return entity;
  }

  public async getManyByColumn(
    values: (number | string)[],
    column: keyof E = 'id',
  ): Promise<E[]> {
    return this.createQueryBuilder('u')
      .where(`u.${column} IN (:...values)`, { values })
      .orderBy(`u.${column}`)
      .getMany();
  }

  public async getPagination(
    options: RepositoryFindManyOptions<E>,
  ): Promise<PaginationResponseDTO<E>> {
    const [items, totalItemsCount] = await this.findAndCount(options);

    return {
      items,
      totalItemsCount,
    };
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

  public async updateEntities(
    items: IRepositoryUpdateEntitiesItem<E>[],
  ): Promise<void> {
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

  public serialize<T extends E>(
    entity: E,
    options?: RepositorySerializeOptions,
  ): T {
    const concatOptions = {
      ...this.defaultSerializeOptions,
      ...(options || null),
    };

    return plainToClass(this.entitySerializer, entity, concatOptions) as T;
  }

  public serializeMany<T extends E>(
    entities: E[],
    options?: RepositorySerializeOptions,
  ): T[] {
    return entities.map((entity) => this.serialize<T>(entity, options));
  }
}
