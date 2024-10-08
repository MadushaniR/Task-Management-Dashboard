import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';
  constructor(private _http: HttpClient, private _webSocketService: WebSocketService) { }

  addTask(data: any): Observable<any> {
    return this._http.post(this.baseUrl, data).pipe(
      switchMap(() => {
        this._webSocketService.sendMessage({ type: 'task-added', data });
        return this.getTaskList();
      })
    );
  }

  // Update Task
  updateTask(id: number, data: any): Observable<any> {
    return this._http.put(`${this.baseUrl}/${id}`, data).pipe(
      switchMap(() => {
        this._webSocketService.sendMessage({ type: 'task-updated', data });
        return this.getTaskList();
      })
    );
  }

  // Delete Task
  deleteTask(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`).pipe(
      switchMap(() => {
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
    return this._http.get<any>(`http://localhost:3000/tasks/${id}`).pipe(
      tap(data => console.log('Fetched task details:', data))
    );
  }
  

 // Add a Subtask
addSubtask(taskId: number, subtask: any): Observable<any> {
  return this._http.get(`${this.baseUrl}/${taskId}`).pipe(
    switchMap((task: any) => {
      const updatedTask = { ...task, subtasks: [...(task.subtasks || []), subtask] };
      return this._http.put(`${this.baseUrl}/${taskId}`, updatedTask).pipe(
        switchMap(() => {
          this._webSocketService.sendMessage({ type: 'subtask-added', taskId, subtask });
          return this.getTaskList(); 
        })
      );
    })
  );
}

// Add a Comment
addComment(taskId: number, comment: any): Observable<any> {
  return this._http.get(`${this.baseUrl}/${taskId}`).pipe(
    switchMap((task: any) => {
      const updatedTask = { ...task, comments: [...(task.comments || []), comment] };
      return this._http.put(`${this.baseUrl}/${taskId}`, updatedTask).pipe(
        switchMap(() => {
          this._webSocketService.sendMessage({ type: 'comment-added', taskId, comment });
          return this.getTaskList(); 
        })
      );
    })
  );
}

}
