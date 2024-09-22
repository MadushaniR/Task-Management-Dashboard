import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';
  constructor(private _http: HttpClient, private _webSocketService: WebSocketService) { }

  // Add Task
  addTask(data: any): Observable<any> {
    return this._http.post(this.baseUrl, data).pipe(
      switchMap(() => {
        // After task is created, broadcast the update via WebSocket
        this._webSocketService.sendMessage({ type: 'task-added', data });
        return this.getTaskList();
      })
    );
  }

  // Update Task
  updateTask(id: number, data: any): Observable<any> {
    return this._http.put(`${this.baseUrl}/${id}`, data).pipe(
      switchMap(() => {
        // Broadcast the update via WebSocket
        this._webSocketService.sendMessage({ type: 'task-updated', data });
        return this.getTaskList();
      })
    );
  }

  // Delete Task
  deleteTask(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`).pipe(
      switchMap(() => {
        // Broadcast the deletion via WebSocket
        this._webSocketService.sendMessage({ type: 'task-deleted', id });
        return this.getTaskList();
      })
    );
  }

  // Get Task List
  getTaskList(): Observable<any> {
    return this._http.get(this.baseUrl);
  }

  // Subscribe to WebSocket task updates
  subscribeToTaskUpdates(): Observable<any> {
    return this._webSocketService.getTaskUpdates();
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
