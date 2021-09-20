import { Repository, ObjectLiteral } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  RepositoryFindConditions,
  RepositoryFindOneOptions,
  RepositorySerializeOptions,
  RepositorySaveEntityOptions,
  RepositoryUpdateEntityInputs,
  RepositorySaveEntity,
  RepositoryDeleteConditions,
  RepositoryCreateEntity,
} from '@app/repositories/types';
import {
  IGetOneOrFailParams,
  IUpdateEntitiesItem,
} from '@app/repositories/interfaces';
import { RepositoryGeneralSerializer } from '@app/repositories/serializers';
import { DEFAULT_REPOSITORY_SERIALISE_OPTIONS } from '@app/repositories/constants';

export class GeneralRepository<
  E extends ObjectLiteral,
  S extends RepositoryGeneralSerializer,
> extends Repository<E> {
  protected readonly defaultSerializeOptions: RepositorySerializeOptions =
    DEFAULT_REPOSITORY_SERIALISE_OPTIONS;

  protected entitySerializer = RepositoryGeneralSerializer;

  public async getOne(
    conditions: RepositoryFindConditions<E>,
    options?: RepositoryFindOneOptions<E>,
    serializeOptions?: RepositorySerializeOptions,
  ): Promise<S | null> {
    const item = await this.findOne(conditions, options);
    return item ? this.serialize(item, serializeOptions) : null;
  }

  public async getOneOrFail(
    { conditions, options, exception }: IGetOneOrFailParams<E>,
    serializeOptions?: RepositorySerializeOptions,
  ) {
    const entity = await this.getOne(conditions, options, serializeOptions);

    if (!entity) {
      throw new exception.type(exception.messages);
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
      this.update.bind(null, criteria, inputs),
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
    conditions: RepositoryDeleteConditions<E>,
  ): Promise<void> {
    await this.delete(conditions);
  }

  public async deleteEntities(
    conditions: RepositoryDeleteConditions<E>,
  ): Promise<void> {
    await this.delete(conditions);
  }

  public serialize(entity: E, options?: RepositorySerializeOptions): S {
    const concatOptions = {
      ...this.defaultSerializeOptions,
      ...(options || null),
    };

    return plainToClass(this.entitySerializer, entity, concatOptions) as S;
  }

  public serializeMany(
    entities: E[],
    options?: RepositorySerializeOptions,
  ): S[] {
    return entities.map((entity) => this.serialize(entity, options));
  }
}
