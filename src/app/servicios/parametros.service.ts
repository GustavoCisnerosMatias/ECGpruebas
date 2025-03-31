import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';
import { Respuestadata, RespuestaData, RespuestaParametros } from '../interfaces/interface';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  private baseUrl = this.servg.URLAPI;

  constructor(private http: HttpClient,private servg:GeneralService) {}

  // Método para obtener los parámetros
  obtenerParametros(): Observable<RespuestaParametros> {
    return this.http.get<RespuestaParametros>(`${this.baseUrl}/listaparametros`);
  }

  obtenerdatosbiome(data: any): Observable<RespuestaData> {
    //console.log('Datos a enviar para obtener datos biome:', data);
    return this.http.post<RespuestaData>(`${this.baseUrl}/datosbiome`, data);
  }

  crearparametros(data: any): Observable<Respuestadata> {
    //console.log('datos para crear nuevo parametros:', data);
    return this.http.post<Respuestadata>(`${this.baseUrl}/crearparametros`, data);
  }
  // Método para eliminar un parámetro


 // Función para eliminar una alergia
 eliminarParametro(id_parametro: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = {
    headers: headers,
    body: { id_parametro } // Enviando el id_alergia en el cuerpo de la solicitud
  };

  return this.http.delete(`${this.baseUrl}/ELIMIparametros`, options).pipe(
    catchError(this.handleError) // Manejo de errores
  );
}
private handleError(error: any) {
  console.error('Error en la solicitud', error);
  return throwError(() => new Error('Error en la solicitud'));
}


  
}
