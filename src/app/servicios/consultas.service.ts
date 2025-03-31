import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private baseUrl = this.servg.URLAPI;
  constructor(private http: HttpClient, private servg:GeneralService) { }





   // Función para listar recetas
listarreceta(id_paciente: number, anio: number): Observable<any> {
  //console.log(id_paciente, anio); // Agregar el año a los logs para verificación
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { id_paciente, anio }; // Enviando id_paciente y anio en el cuerpo
  return this.http.post(`${this.baseUrl}/LISTARECETAS`, body, { headers }).pipe(
    catchError(this.handleError) // Manejo de errores
  );
}


Guardarconsultas(consultaData: any): Observable<any> {
  //console.log(consultaData);
  return this.http.post<any>(`${this.baseUrl}/Guardarconsultas`, consultaData);
}


    private handleError(error: any) {
      console.error('Error en la solicitud', error);
      return throwError(() => new Error('Error en la solicitud'));
    }
}




