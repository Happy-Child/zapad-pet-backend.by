import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { ENTITIES_FIELDS } from '@app/constants';

export const getPreparedChildrenErrors = (
  list: { index: number }[],
  params: {
    field: string;
    messages: string[];
  },
): IErrorDetailItem[] => {
  const children = list.map(({ index }) => ({
    field: index,
    children: [
      {
        field: params.field,
        messages: params.messages,
      },
    ],
  }));

  return [
    {
      field: ENTITIES_FIELDS.USERS,
      children,
    },
  ];
};
