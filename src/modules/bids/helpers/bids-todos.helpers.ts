import { BID_TODO_STATUS } from '../constants';
import { NonEmptyArray } from '@app/types';

export const getBidTodosToFirstSave = <T>(
  todos: NonEmptyArray<T>,
): NonEmptyArray<T> => {
  const firstTodo = {
    ...todos[0],
    status: BID_TODO_STATUS.IN_WORK,
  };

  if (todos.length === 1) {
    return [firstTodo];
  }

  return [firstTodo, ...todos];
};
