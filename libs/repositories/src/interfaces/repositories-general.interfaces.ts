import { BadRequestException } from '@nestjs/common';
import {
  RepositoryFindConditions,
  RepositoryFindOneOptions,
  RepositoryUpdateEntityInputs,
} from '@app/repositories/types';
import { IErrorDetailItem } from '@app/exceptions/interfaces';

export interface IGetOneOrFailParams<E> {
  conditions: RepositoryFindConditions<E>;
  options?: RepositoryFindOneOptions<E>;
  exception: {
    type: typeof BadRequestException;
    messages: IErrorDetailItem[];
  };
}

export interface IUpdateEntitiesItem<E> {
  criteria: RepositoryFindConditions<E>;
  inputs: RepositoryUpdateEntityInputs<E>;
}
