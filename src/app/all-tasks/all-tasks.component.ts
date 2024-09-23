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

  @Select(TaskState.getTaskList) tasks$!: Observable<any[]>; // Use getTaskList instead of getTasks

  constructor(
    private _dialog: MatDialog,
    private _taskService: TaskService,
    private _coreService: CoreService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getTaskList();
    this.subscribeToRealTimeUpdates(); // Subscribe to WebSocket updates
    this.tasks$.subscribe((tasks) => {
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Open Add/Edit Task Form
  openAddEditTaskForm() {
    const dialogRef = this._dialog.open(TaskAddEditComponent);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new GetTaskList()); // Dispatch action to refresh task list
      }
    });
  }

  // Open Edit Task Form
  openEditForm(taskData: any) {
    const dialogRef = this._dialog.open(TaskAddEditComponent, {
      data: taskData, // Pass the task data to the form for editing
    });

    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new GetTaskList()); // Refresh the task list after editing
      }
    });
  }

  // Open Delete Confirmation Dialog
  openDeleteConfirmation(taskId: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationDialogComponent, {
      data: { id: taskId } // Pass the task ID to the delete confirmation dialog
    });

    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(new DeleteTask(taskId)).subscribe({
          next: () => {
            this._coreService.openSnackBar('Task deleted successfully');
            this.store.dispatch(new GetTaskList()); // Refresh the task list after deletion
          },
          error: console.log,
        });
      }
    });
  }

  // Fetch Task List
  getTaskList() {
    this.store.dispatch(new GetTaskList()).subscribe({
      error: console.log,
    });
  }

  // Apply filter to the task list
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Subscribe to WebSocket updates for real-time task changes
  subscribeToRealTimeUpdates() {
    this._taskService.subscribeToTaskUpdates().subscribe((message) => {
      if (message) {
        // Check message type and handle accordingly
        switch (message.type) {
          case 'task-added':
          case 'task-updated':
          case 'task-deleted':
            this.store.dispatch(new GetTaskList()); // Fetch updated task list on any relevant event
            break;
          default:
            break; // Ignore other message types
        }
      }
    });
  }
}
