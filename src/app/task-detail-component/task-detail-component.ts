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
  taskData: any;
  newSubtask: string = '';
  newComment: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.taskId); // Log the ID to check
    this.getTaskDetails();
  }
  

  // Fetch task details by ID
  getTaskDetails() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data: any) => {
        this.taskData = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  // Navigate back to task list
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Add a subtask to the task
  addSubtask() {
    if (this.newSubtask.trim()) {
      const subtask = { subtask_title: this.newSubtask.trim() };
      this.taskService.addSubtask(this.taskId, subtask).subscribe({
        next: (updatedTask: any) => {
          this.taskData = updatedTask;
          this.newSubtask = '';
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  // Add a comment to the task
  addComment() {
    if (this.newComment.trim()) {
      const comment = { text: this.newComment.trim() };
      this.taskService.addComment(this.taskId, comment).subscribe({
        next: (updatedTask: any) => {
          this.taskData = updatedTask;
          this.newComment = '';
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  // Subscribe to WebSocket updates for real-time task changes
  subscribeToRealTimeUpdates() {
    this.taskService.subscribeToTaskUpdates().subscribe((message: any) => {
      if (message && message.data && message.data.id === this.taskId) {
        this.getTaskDetails(); // Refresh the task details if this task was updated
      }
    });
  }
}
