import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TaskService } from '../../services/task.service';
import { Injectable } from '@angular/core';
import { AddTask, UpdateTask, DeleteTask, GetTaskList } from '../../store/actions/task.actions';
import { tap } from 'rxjs/operators';

export interface TaskStateModel {
  tasks: any[];
}

@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    tasks: []
  }
})

@Injectable()
export class TaskState {
  constructor(private taskService: TaskService) {}

  @Selector()
  static getTaskList(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(GetTaskList)
  getTasks(ctx: StateContext<TaskStateModel>) {
    return this.taskService.getTaskList().pipe(
      tap((result) => {
        ctx.patchState({ tasks: result });
      })
    );
  }

  @Action(AddTask)
  addTask(ctx: StateContext<TaskStateModel>, action: AddTask) {
    return this.taskService.addTask(action.payload).pipe(
      tap(() => {
        ctx.dispatch(new GetTaskList());
      })
    );
  }

  @Action(UpdateTask)
  updateTask(ctx: StateContext<TaskStateModel>, action: UpdateTask) {
    return this.taskService.updateTask(action.id, action.payload).pipe(
      tap(() => {
        ctx.dispatch(new GetTaskList());
      })
    );
  }

  @Action(DeleteTask)
  deleteTask(ctx: StateContext<TaskStateModel>, action: DeleteTask) {
    return this.taskService.deleteTask(action.id).pipe(
      tap(() => {
        ctx.dispatch(new GetTaskList());
      })
    );
  }
}
