import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';
  constructor(private _http: HttpClient) { }

  addTask(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/tasks', data);
  }

  updateTask(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/tasks/${id}`, data);
  }

  getTaskList(): Observable<any> {
    return this._http.get('http://localhost:3000/tasks');
  }

  deleteTask(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/tasks/${id}`);
  }

  getTaskById(id: number): Observable<any> {
    return this._http.get(`http://localhost:3000/tasks/${id}`);
  }

  // add a subtask
  addSubtask(taskId: number, subtask: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/${taskId}`).pipe(
      switchMap((task: any) => {
        const updatedTask = { ...task, subtasks: [...task.subtasks, subtask] };
        return this._http.put(`${this.baseUrl}/${taskId}`, updatedTask);
      })
    );
  }

  // add a comment
  addComment(taskId: number, comment: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/${taskId}`).pipe(
      switchMap((task: any) => {
        const updatedTask = { ...task, comments: [...task.comments, comment] };
        return this._http.put(`${this.baseUrl}/${taskId}`, updatedTask);
      })
    );
  }

}
