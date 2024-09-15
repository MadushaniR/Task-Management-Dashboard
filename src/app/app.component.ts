import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskAddEditComponent } from './task-add-edit/task-add-edit.component';
import { TaskService } from './services/task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TaskDetailComponent } from './task-detail-component/task-detail-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
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
  }

  // Open the Add/Edit Task Form
  openAddEditTaskForm() {
    const dialogRef = this._dialog.open(TaskAddEditComponent);

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
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

  // Filter the Task List
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Open the Delete Confirmation Dialog
  openDeleteConfirmation(id: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      // Delete the task if confirmed
      if (confirmed) {
        this._taskService.deleteTask(id).subscribe({
          next: (res) => {
            this._coreService.openSnackBar('Task deleted!', 'done');
            this.getTaskList();
          },
          error: console.log,
        });
      }
    });
  }

  // Open the Edit Task Form 
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(TaskAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTaskList();
        }
      },
    });
  }
}
