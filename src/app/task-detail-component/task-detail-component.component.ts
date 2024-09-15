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
  
}
