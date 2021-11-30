import { SIDE } from '@app/constants';

export const getSideRelativeItemInList = <T extends { id: number }>(
  targetItemId: number,
  relativeItemId: number,
  list: T[],
): SIDE | null => {
  if (targetItemId === relativeItemId) {
    return SIDE.MIDDLE;
  }

  const targetIndex = list.findIndex(({ id }) => targetItemId === id);
  const relativeIndex = list.findIndex(({ id }) => relativeItemId === id);

  if ([targetIndex, relativeIndex].includes(-1)) {
    return null;
  }

  return relativeIndex > targetIndex ? SIDE.LEFT : SIDE.RIGHT;
};
