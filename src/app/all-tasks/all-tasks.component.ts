import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../services/task.service';
import { CoreService } from '../core/core.service';
import { TaskAddEditComponent } from '../task-add-edit/task-add-edit.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Select, Store } from '@ngxs/store';
import { GetTaskList, DeleteTask } from '../store/actions/task.actions';
import { TaskState } from '../services/tasks.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.scss']
})
export class AllTasksComponent implements OnInit {
  displayedColumns: string[] = [
    'taskName',
    'description',
    'dueDate',
    'priority',
    'status',
    'assignedTo',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Select(TaskState.getTaskList) tasks$!: Observable<any[]>;

  constructor(
    private _dialog: MatDialog,
    private _taskService: TaskService,
    private _coreService: CoreService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getTaskList();
    this.subscribeToRealTimeUpdates(); 
    this.tasks$.subscribe((tasks) => {
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditTaskForm() {
    const dialogRef = this._dialog.open(TaskAddEditComponent);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new GetTaskList());
      }
    });
  }

  openEditForm(taskData: any) {
    const dialogRef = this._dialog.open(TaskAddEditComponent, { data: taskData });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new GetTaskList());
      }
    });
  }

  openDeleteConfirmation(taskId: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationDialogComponent, {
      data: { id: taskId }
    });
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new DeleteTask(taskId)).subscribe({
          next: () => {
            this._coreService.openSnackBar('Task deleted successfully');
            this.store.dispatch(new GetTaskList());
          },
          error: console.log,
        });
      }
    });
  }

  getTaskList() {
    this.store.dispatch(new GetTaskList()).subscribe({
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  subscribeToRealTimeUpdates() {
    this._taskService.subscribeToTaskUpdates().subscribe((message) => {
      if (message) {
        switch (message.type) {
          case 'task-added':
          case 'task-updated':
          case 'task-deleted':
            this.store.dispatch(new GetTaskList());
            break;
          default:
            break;
        }
      }
    });
  }
}
