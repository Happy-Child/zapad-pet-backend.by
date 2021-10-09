import { ENTITIES_FIELDS } from '@app/constants';

export interface IGetPreparedChildrenErrorsParams {
  field: ENTITIES_FIELDS;
  messages: string[];
}
