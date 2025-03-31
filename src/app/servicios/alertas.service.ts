import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { alertas, alertasme } from '../interfaces/interface';
import { BehaviorSubject } from 'rxjs';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';
@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  private baseUrl = this.servg.URLAPI;
  private alertasSubject = new BehaviorSubject<alertas[]>([]);
  public alertas$ = this.alertasSubject.asObservable();
  private alertasSubjecta = new BehaviorSubject<alertasme[]>([]);
  constructor(private http: HttpClient,private servg:GeneralService) {}


   // Método para obtener tipos de alertas
   obtenertipoalerta(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listartipoalerta`);
  }
  creartiposdealerta(datostipo: any): Observable<any> {
    //console.log(datostipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/creartipoaler`, datostipo, { headers }).pipe(
      catchError(this.handleError)
      
    );
  }
  editartiposdealerta(datostipoed: any): Observable<any> {
    //console.log(datostipoed);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/editipoalert`, datostipoed, { headers }).pipe(
      catchError(this.handleError)
      
    );
  }

  // Método para eliminar un tipo de alerta
  eliminartipoalerta(id_tipoalerta: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.baseUrl}/elitipoaler`, {
      headers,
      body: { id_tipoalerta } // Enviando el ID en el cuerpo de la solicitud DELETE
    }).pipe(
      catchError(this.handleError)
    );
  }






  obtenerAlertas(id_usuario: number): Observable<{ Alertas: alertas[] }> {
    return this.http.post<{ Alertas: alertas[] }>(`${this.baseUrl}/listaralertas`, { id_usuario });
  }
  obtenerAlertasfecha(id_usuario: number, fecha_ini: string, fecha_fin: string): Observable<{ Alertas: alertas[] }> {
    return this.http.post<{ Alertas: alertas[] }>(`${this.baseUrl}/listaralertasfecha`, { id_usuario, fecha_ini, fecha_fin });
  }
  
  actualizarVistaAlerta(id_alertas: number): Observable<any> {
    const payload = { id_alertas, vista: 'Visto' };
    return this.http.post(`${this.baseUrl}/actualizarVista`, payload);
  }

  cargarAlertas(id_usuario: number) {
    this.obtenerAlertas(id_usuario).subscribe(response => {
      this.alertasSubject.next(response.Alertas|| []);
    });
  }

  /* guardarEstadoPaciente(payload: { id_alertas: number, descripcion: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/guardarestadopaciente`, payload);
  } */
  
  // Función para alertas_notas
  crearnotas_alertas(datosusuario: any): Observable<any> {
   // console.log(datosusuario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/estado_alertasrel`, datosusuario, { headers }).pipe(
      catchError(this.handleError)
      
    );
  }
   // Método para obtener la lista de médicos
   obtenernotas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listanota`);
  }
 /*  cargartodasAlertasmedi(id_usuario: number) {
    this.obtenerAlertasmedi(id_usuario).subscribe(response => {
      this.alertasSubjecta.next(response.Alertas);
    });
  }
  obtenerAlertasmedi(id_usuario: number): Observable<{ Alertas: alertasme[] }> {
    return this.http.post<{ Alertas: alertasme[] }>(`${this.baseUrl}/mostrartodasalerfiltra`, { id_usuario });
  } */
 
cargartodasAlertasmedi(id_usuario: number): Observable<{ Alertas: alertasme[] }> {
   //console.log(id_usuario);
      return this.http.post<{ Alertas: alertasme[] }>(`${this.baseUrl}/mostrartodasalerfiltra`, { id_usuario });
    }
  // Manejo de errores
  private handleError(error: any): Observable<never> {
    //console.error('Ocurrió un error:', error);
    return throwError(error);
  }
}
