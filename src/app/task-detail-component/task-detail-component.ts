import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail-component',
  templateUrl: './task-detail-component.html',
  styleUrls: ['./task-detail-component.scss']
})
export class TaskDetailComponent implements OnInit {
  taskId!: number;
  taskData: any = { subtasks: [], comments: [] };
  newSubtask: string = '';
  newComment: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskId = idParam ? parseInt(idParam, 10) : NaN;

    if (!isNaN(this.taskId)) {
      this.getTaskDetails();
    } else {
      console.error('Invalid task ID:', idParam);
      this.goBack();
    }

    this.subscribeToRealTimeUpdates(); 
  }
  
  getTaskDetails() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data: any) => {
        this.taskData = data;
        this.taskData.subtasks = this.taskData.subtasks || [];
        this.taskData.comments = this.taskData.comments || [];
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
        next: () => {
          this.newSubtask = '';
          this.getTaskDetails();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  addComment() {
    if (this.newComment.trim()) {
      const comment = { text: this.newComment.trim() };
      this.taskService.addComment(this.taskId, comment).subscribe({
        next: () => {
          this.newComment = '';
          this.getTaskDetails();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  subscribeToRealTimeUpdates() {
    this.taskService.subscribeToTaskUpdates().subscribe((message: any) => {
      if (message && message.data && message.data.id === this.taskId) {
        this.getTaskDetails();
      }
    });
  }
}
