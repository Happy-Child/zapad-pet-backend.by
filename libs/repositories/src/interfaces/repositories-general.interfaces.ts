import { BadRequestException } from '@nestjs/common';
import {
  RepositoryFindConditions,
  RepositoryFindOneOptions,
  RepositorySerializeOptions,
  RepositoryUpdateEntityInputs,
} from '@app/repositories/types';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { BaseEntity } from '@app/entities';

export interface IRepositoryException {
  type?: typeof BadRequestException;
  messages?: IErrorDetailItem[];
}

export interface IGetOneOptions<E extends BaseEntity> {
  repository?: RepositoryFindOneOptions<E>;
  serialize?: RepositorySerializeOptions;
}

export interface IGetOneOrFailOptions<E extends BaseEntity>
  extends IGetOneOptions<E> {
  exception?: IRepositoryException;
}

export interface IUpdateEntitiesItem<E extends BaseEntity> {
  criteria: RepositoryFindConditions<E>;
  inputs: RepositoryUpdateEntityInputs<E>;
}
