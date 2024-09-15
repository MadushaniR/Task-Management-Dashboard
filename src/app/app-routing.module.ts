import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailComponentComponent } from './task-detail-component/task-detail-component.component'; 
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { AllTasksComponent } from './all-tasks/all-tasks.component';

const routes: Routes = [
  { path: 'tasks', component: AllTasksComponent }, 
  { path: 'view-task/:id', component: TaskDetailComponentComponent }, 
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks' }  
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
