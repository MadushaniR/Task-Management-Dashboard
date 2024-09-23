import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | undefined;

  private taskUpdates$ = new BehaviorSubject<any>(null);

  constructor() { }

  // Connect to the WebSocket server
  connect(url: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = new WebSocketSubject(url);
      this.socket$.subscribe(
        message => this.taskUpdates$.next(message), 
        error => console.error('WebSocket error', error), 
        () => console.warn('WebSocket connection closed') 
      );
    }
  }

  // Get updates from the WebSocket server
  getTaskUpdates(): Observable<any> {
    return this.taskUpdates$.asObservable();
  }

  // Send a message to the WebSocket server
  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  // Close the WebSocket connection
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = undefined;
    }
  }
}
