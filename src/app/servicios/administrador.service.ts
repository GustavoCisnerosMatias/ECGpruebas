import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { alertas } from '../interfaces/interface';
import { BehaviorSubject } from 'rxjs';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private baseUrl = this.servg.URLAPI;
  

  constructor(private http: HttpClient,private servg:GeneralService) {}




  lista_dispositivos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listartodo_dispositivo`);
  }
  lista_medicos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listatodmedic`);
  }

  lista_usuarios(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/LISTARUSER`);
  }
  

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(error);
  }

   /*  obtenerAlertas(id_usuario: number): Observable<{ Alertas: alertas[] }> {
    return this.http.post<{ Alertas: alertas[] }>(`${this.baseUrl}/listaralertas`, { id_usuario });
  }

  actualizarVistaAlerta(id_alertas: number): Observable<any> {
    const payload = { id_alertas, vista: 'Visto' };
    return this.http.post(`${this.baseUrl}/actualizarVista`, payload);
  }
 */
}
