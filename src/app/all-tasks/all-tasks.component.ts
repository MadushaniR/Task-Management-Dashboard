import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../services/task.service';
import { CoreService } from '../core/core.service';
import { TaskAddEditComponent } from '../task-add-edit/task-add-edit.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

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

  constructor(
    private _dialog: MatDialog,
    private _taskService: TaskService,
    private _coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.getTaskList();
    this.subscribeToRealTimeUpdates(); // Subscribe to WebSocket updates
  }

  // Open Add/Edit Task Form
  openAddEditTaskForm() {
    const dialogRef = this._dialog.open(TaskAddEditComponent);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.getTaskList();
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
        this.getTaskList(); // Refresh the task list after editing
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
        this._taskService.deleteTask(taskId).subscribe({
          next: () => {
            this._coreService.openSnackBar('Task deleted successfully');
            this.getTaskList(); // Refresh the task list after deletion
          },
          error: console.log,
        });
      }
    });
  }

  // Fetch Task List
  getTaskList() {
    this._taskService.getTaskList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
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
            this.getTaskList(); // Fetch updated task list on any relevant event
            break;
          default:
            break; // Ignore other message types
        }
      }
    });
  }
}
