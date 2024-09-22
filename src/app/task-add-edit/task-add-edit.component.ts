import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  status: string[] = [
    'To do',
    'In Progress',
    'Completed',
  ];

  assignedTo: string[] = [
    'Anne',
    'Roy',
    'Tom',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService
  ) {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.taskForm.patchValue(this.data);
    }
  }

  onFormSubmit() {
    if (this.taskForm.valid) {
      if (this.data) {
        this.taskService.updateTask(this.data.id, this.taskForm.value).subscribe({
          next: (response: any) => {
            this.coreService.openSnackBar('Task detail updated!');
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      } else {
        this.taskService.addTask(this.taskForm.value).subscribe({
          next: (response: any) => {
            this.coreService.openSnackBar('Task added successfully');
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      }
    }
  }
}
