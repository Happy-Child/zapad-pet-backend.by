import { ObjectLiteral, SaveOptions, FindOneOptions } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { ClassTransformOptions } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export type RepositoryFindConditions<E extends ObjectLiteral> =
  FindConditions<E>;

export type RepositoryFindOneOptions<E extends ObjectLiteral> =
  FindOneOptions<E>;

export type RepositoryUpdateEntityInputs<E extends ObjectLiteral> =
  QueryDeepPartialEntity<E>;

export type RepositoryDeleteConditions<E extends ObjectLiteral> =
  | number
  | string
  | number[]
  | string[]
  | RepositoryFindConditions<E>;

export type RepositorySaveEntity<E extends ObjectLiteral> = DeepPartial<E>;

export type RepositoryCreateEntity<E extends ObjectLiteral> = DeepPartial<E>;

export type RepositorySaveEntityOptions = SaveOptions;

export type RepositorySerializeOptions = ClassTransformOptions;
