import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = this.servg.URLAPI;

  constructor(private http: HttpClient , private servg:GeneralService) { }

// Manejo de errores
private handleError(error: any): Observable<never> {
  console.error('Ocurrió un error:', error);
  return throwError(error);
}
////////////////////chat///////////////////





  Listarchatnuevo(id_usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_usuario }; // Aquí se envía el JSON con el id_usuario
    //console.log(id_usuario)
    return this.http.post(`${this.baseUrl}/nuevochatpaci`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  Listarchatnuevomedi(id_usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_usuario }; // Aquí se envía el JSON con el id_usuario
    //console.log(id_usuario)
    return this.http.post(`${this.baseUrl}/nuevochatmedi`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  Listarchatnuevomeditodos(ids_usuarios: number[], ids_medicos: number[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { ids_usuarios, ids_medicos }; // Enviar el JSON con las listas de IDs
    return this.http.post(`${this.baseUrl}/nuevochatmeditodos`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  

//listar chat quiere decir ver los mensajes que ya hay se envia id_medico y id_usuario en json
Listarchat(listarchat: any): Observable<any> {
  // console.log(listarchat);
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post(`${this.baseUrl}/listarchat`, listarchat, { headers }).pipe(
     catchError(this.handleError)
   );
 }
 //enviar chat se envia id_medico,id_usuario, mensaje en json
 Enviarchat(enviarmensaje: any): Observable<any> {
  // console.log(enviarmensaje);
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post(`${this.baseUrl}/enviarmensaje`, enviarmensaje, { headers }).pipe(
     catchError(this.handleError)
   );
 }
 //actualizar vista enviando id_mensaje
 Actualizarvistamensaje(actualizarvista: any): Observable<any> {
  // console.log(actualizarvista);
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post(`${this.baseUrl}/actualizarchat`, actualizarvista, { headers }).pipe(
     catchError(this.handleError)
   );
 }
}