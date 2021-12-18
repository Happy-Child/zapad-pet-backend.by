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
  IRepositoryGetManyOptions,
  IRepositoryGetOneOptions,
  IRepositoryGetOneOrFailOptions,
  IRepositoryUpdateEntitiesItem,
} from '@app/repositories/interfaces';
import { DEFAULT_REPOSITORY_SERIALISE_OPTIONS } from '@app/repositories/constants';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { BaseEntity } from '@app/entities/base.entity';
import { NonEmptyArray } from '@app/types';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

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

  public async getMany(
    conditions: RepositoryFindConditions<E>,
    { serialize }: IRepositoryGetManyOptions = {},
  ): Promise<E[]> {
    const items = await this.find(conditions);
    return this.serializeMany(items, serialize);
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
    values: NonEmptyArray<E[keyof E]>,
    column: keyof E = 'id',
  ): Promise<E[]> {
    return this.createQueryBuilder('t')
      .where(`t.${column} IN (:...values)`, { values })
      .orderBy(`t.${column}`)
      .getMany();
  }

  public async returnNotExistingColumnValues(
    column: keyof E = 'id',
    values: NonEmptyArray<E[keyof E]>,
  ): Promise<E[keyof E][]> {
    const records = await this.getManyByColumn(values, column);
    const recordsIds = records.map((r) => r[column]);
    return values.filter((v) => !recordsIds.includes(v));
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

  public async deleteEntitiesByWhere(
    where: string,
    parameters?: ObjectLiteral,
  ): Promise<void> {
    await this.createQueryBuilder('t')
      .where(where, parameters)
      .delete()
      .execute();
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
