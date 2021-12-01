import { Injectable } from '@nestjs/common';
import { BidsTodosRepository } from '../../repositories';
import { BID_TODO_STATUS } from '../../constants';
import { SIDE } from '@app/constants';
import { BidTodoEntity } from '@app/entities';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';

@Injectable()
export class BidsTodosUpdateService {
  constructor(private readonly bidsTodosRepository: BidsTodosRepository) {}

  public async updateBidTodoBySide(
    side: SIDE.LEFT | SIDE.MIDDLE,
    todoId: number,
    nextStatus: BID_TODO_STATUS,
    todos: { id: number }[],
  ): Promise<void> {
    if (todos.length === 1) {
      await this.updateSingleTodo(todoId, nextStatus);
      return;
    }

    if (side === SIDE.LEFT) {
      await this.updatePrevBidTodo(todoId, todos);
    } else {
      await this.updateCurTodoInWork(todoId, todos);
    }
  }

  public async updateSingleTodo(
    id: number,
    status: BID_TODO_STATUS,
  ): Promise<void> {
    await this.bidsTodosRepository.updateEntity({ id }, { status });
  }

  public async updatePrevBidTodo(
    targetTodoId: number,
    todos: { id: number }[],
  ): Promise<void> {
    const targetIndex = todos.findIndex(({ id }) => id === targetTodoId);
    const todosToResetStatus = todos.slice(targetIndex + 1);

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<BidTodoEntity>[] = [
      ...todosToResetStatus.map((todo) => ({
        criteria: { id: todo.id },
        inputs: { status: BID_TODO_STATUS.PENDING },
      })),
      {
        criteria: { id: targetTodoId },
        inputs: { status: BID_TODO_STATUS.IN_WORK },
      },
    ];

    await this.bidsTodosRepository.updateEntities(recordsToUpdate);
  }

  public async updateCurTodoInWork(
    targetTodoId: number,
    todos: { id: number }[],
  ): Promise<void> {
    const targetIndex = todos.findIndex(({ id }) => id === targetTodoId);
    const nextTodo = todos[targetIndex + 1];

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<BidTodoEntity>[] = [
      {
        criteria: { id: targetTodoId },
        inputs: { status: BID_TODO_STATUS.COMPLETED },
      },
    ];

    if (nextTodo) {
      recordsToUpdate.push({
        criteria: { id: nextTodo.id },
        inputs: { status: BID_TODO_STATUS.IN_WORK },
      });
    }

    await this.bidsTodosRepository.updateEntities(recordsToUpdate);
  }
}
