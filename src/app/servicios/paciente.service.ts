import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private baseUrl = this.servg.URLAPI;

  constructor(private http: HttpClient, private servg:GeneralService) {}

    // Función para listar antecedente
    Obtenerantecepersonal(id_paciente: number): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = { id_paciente }; // Enviando el id_usuario en el cuerpo
      return this.http.post(`${this.baseUrl}/listaranteper`, body, { headers }).pipe(
        catchError(this.handleError) // Manejo de errores
      );
    }

   // Función para listar usuarios
   Obtenerantecefamixid(id_paciente: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_paciente }; // Enviando el id_usuario en el cuerpo
    return this.http.post(`${this.baseUrl}/ante_fliaxid`, body, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud', error);
    return throwError(() => new Error('Error en la solicitud'));
  }
 obtenerDatosFisicos(id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_usuario }; // Enviando el id_usuario en el cuerpo
    return this.http.post(`${this.baseUrl}/listar_datosfisicos`, body, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  guardarAntecedenteFamiliar(antecedente: any): Observable<any> {
    //console.log(antecedente);
    return this.http.post<any>(`${this.baseUrl}/guardar_ante_fami`, antecedente);
  }


  actualizarAntecedenteFamiliar(antecedente: any): Observable<any> {
    //console.log(antecedente);
    return this.http.post<any>(`${this.baseUrl}/actua_ante_fami`, antecedente);
  }

  //alergias

  Obteneralergiasxid(id_paciente: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_paciente }; // Enviando el id_usuario en el cuerpo
    return this.http.post(`${this.baseUrl}/alergias`, body, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

 // Método para obtener los parámetros
 Listarmedicamentos(): Observable<any> {
  return this.http.get(`${this.baseUrl}/listarmedicamentos`);
}

actualizaralergias(alergia: any): Observable<any> {
  //console.log(alergia);
  return this.http.put<any>(`${this.baseUrl}/editaralergia`, alergia);
}
 // Método para tipo de alerta
 obtenertipoalerta(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/tipoalergia`);
}
 // Función para eliminar una alergia
 eliminaralergia(id_alergia: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = {
    headers: headers,
    body: { id_alergia } // Enviando el id_alergia en el cuerpo de la solicitud
  };

  return this.http.delete(`${this.baseUrl}/eliminarAlergi`, options).pipe(
    catchError(this.handleError) // Manejo de errores
  );
}
guardarAlergia(alergia: any): Observable<any> {
  //console.log(alergia);
  return this.http.post<any>(`${this.baseUrl}/guardaralergia`, alergia);
}


}
