import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail-component',
  templateUrl: './task-detail-component.component.html',
  styleUrls: ['./task-detail-component.component.scss']
})
export class TaskDetailComponentComponent implements OnInit {
  taskId!: number;
  taskData: any;
  newSubtask: string = '';
  newComment: string = '';

  constructor(
    private router: Router, private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    this.getTaskDetails();
  }

  getTaskDetails() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data: any) => {
        this.taskData = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      const subtask = { subtask_title: this.newSubtask.trim() };
      this.taskService.addSubtask(this.taskId, subtask).subscribe({
        next: (data: any) => {
          this.taskData.subtasks.push(data);
          this.newSubtask = '';
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment = { text: this.newComment.trim() };
      this.taskService.addComment(this.taskId, comment).subscribe({
        next: (data: any) => {
          this.taskData.comments.push(data);
          this.newComment = '';
        },
        error: (err: any) => console.error(err)
      });
    }
  }
  
}
