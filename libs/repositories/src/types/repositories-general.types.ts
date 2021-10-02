import { SaveOptions, FindOneOptions } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { ClassTransformOptions } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from '@app/entities';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export type RepositoryFindConditions<E extends BaseEntity> = FindConditions<E>;

export type RepositoryFindOneOptions<E extends BaseEntity> = FindOneOptions<E>;

export type RepositoryFindManyOptions<E extends BaseEntity> =
  FindManyOptions<E>;

export type RepositoryUpdateEntityInputs<E extends BaseEntity> =
  QueryDeepPartialEntity<E>;

export type RepositoryDeleteOneConditions<E extends BaseEntity> =
  | number
  | string
  | RepositoryFindConditions<E>;

export type RepositoryDeleteByIdsConditions = number[] | string[];

export type RepositorySaveEntity<E extends BaseEntity> = DeepPartial<E>;

export type RepositoryCreateEntity<E extends BaseEntity> = DeepPartial<E>;

export type RepositorySaveEntityOptions = SaveOptions;

export type RepositorySerializeOptions = ClassTransformOptions;
