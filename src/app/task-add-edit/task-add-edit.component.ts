import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'task-task-add-edit',
  templateUrl: './task-add-edit.component.html',
  styleUrls: ['./task-add-edit.component.scss'],
})
export class TaskAddEditComponent implements OnInit {
  taskForm: FormGroup;

  priority: string[] = [
    'Low',
    'Medium',
    'High',
  ];

  constructor(
    private _fb: FormBuilder,
    private _taskService: TaskService,
    private _dialogRef: MatDialogRef<TaskAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.taskForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      priority: '',
      company: '',
      experience: '',
      package: '',
    });
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.taskForm.valid) {
      if (this.data) {
        this._taskService
          .updateTask(this.data.id, this.taskForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Task detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._taskService.addTask(this.taskForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Task added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
