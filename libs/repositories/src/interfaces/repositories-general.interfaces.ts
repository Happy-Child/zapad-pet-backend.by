import { BadRequestException } from '@nestjs/common';
import {
  RepositoryFindConditions,
  RepositoryFindOneOptions,
  RepositorySerializeOptions,
  RepositoryUpdateEntityInputs,
} from '@app/repositories/types';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { BaseEntity } from '@app/entities/base.entity';

export interface IRepositoryException {
  type?: typeof BadRequestException;
  messages?: IErrorDetailItem[];
}

export interface IRepositoryGetOneOptions<E extends BaseEntity> {
  repository?: RepositoryFindOneOptions<E>;
  serialize?: RepositorySerializeOptions;
}

export interface IRepositoryGetManyOptions {
  serialize?: RepositorySerializeOptions;
}

export interface IRepositoryGetOneOrFailOptions<E extends BaseEntity>
  extends IRepositoryGetOneOptions<E> {
  exception?: IRepositoryException;
}

export interface IRepositoryUpdateEntitiesItem<E extends BaseEntity> {
  criteria: RepositoryFindConditions<E>;
  inputs: RepositoryUpdateEntityInputs<E>;
}
