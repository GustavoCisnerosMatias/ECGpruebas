import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private periodicSubscription?: Subscription; // Para almacenar la suscripción periódica

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080/websocket-server');
  }

  sendMessage(message: any): void {
    this.socket$.next(message);
    console.log(message);
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  sendMessagePeriodically(message: any, intervalMs: number): void {
    this.periodicSubscription = interval(intervalMs).subscribe(() => {
      this.sendMessage(message);
    });
  }

  disconnect(): void {
    if (this.periodicSubscription) {
      this.periodicSubscription.unsubscribe(); // Cancelar la suscripción periódica
    }
    this.socket$.complete(); // Completar el observable para cerrar la conexión
  }
}
