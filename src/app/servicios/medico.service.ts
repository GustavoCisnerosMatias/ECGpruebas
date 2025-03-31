import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

    private baseUrl = this.servg.URLAPI;

  constructor(private http: HttpClient , private servg:GeneralService) { }

  //VERIFICACION DE TITULO MEDICOS
  verificaciondetitulos(cedula: number): Observable<any> {
    const body = { cedula: cedula };
    return this.http.post<any>(`${this.baseUrl}/VerificarMedicos`, body);
  }

  // Método para obtener la lista de médicos
  obtenerMedicos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listarmedico`);
  }
  // Método para obtener la lista de médicos
  obtenerespecialidad(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listaespe`);
  }
   // Método para obtener la lista de médicos
   obtenercentro_hospitalario(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listacentro`);
  }



     // Implementación para obtener id_usuario por cédula
  obtenerIdUsuarioPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Buscarxcedula_id?cedula=${cedula}`);
  }


  // Método para guardar la relación médico-paciente
  guardarRelacionMedicoPaciente(idUsuario: number, idMedico: number): Observable<any> {
    const body = { id_usuario: idUsuario, id_medico: idMedico };
    return this.http.post<any>(`${this.baseUrl}/guardarmedico`, body);
  }
  obtenerMedicosPorUsuario(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listmedi/?id_usuario=${id_usuario}`);
  }
//eliminar medico
eliminarRelacionMedicoPaciente(id_medpaci: number): Observable<any> {
  // Enviamos el parámetro en el cuerpo de la solicitud POST
  return this.http.post<any>(`${this.baseUrl}/elimRelacion`, { id_medpaci: id_medpaci }, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  // Función para crear datos del médico
  creardatosUsuario(datosusuario: any): Observable<any> {
    //console.log(datosusuario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/crear_medico`, datosusuario, { headers }).pipe(
      catchError(this.handleError)

    );
  }
// crear horarios
creardatosHorarios(datoshorario: any): Observable<any> {
  //console.log(datoshorario);
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseUrl}/crear_horarios`, datoshorario, { headers }).pipe(
    catchError(this.handleError)
  );
}

// editar horarios

editardatosHorarios(datoshorario: any): Observable<any> {
  //console.log(datoshorario);
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseUrl}/editar_horarios`, datoshorario, { headers }).pipe(
    catchError(this.handleError)
  );
}

//listar horarios
listarhorarios(id_usuario: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { id_usuario: id_usuario }; // Crea un objeto JSON con el id_usuario

  //console.log(id_usuario); // Esto sigue siendo útil para depuración
  return this.http.post<any>(`${this.baseUrl}/LIS_horarios`, body, { headers });
}

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(error);
  }

  obtenerpacientes(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listapacientes/?id_usuario=${id_usuario}`);
  }

   // Método para actualizar el estado de la relación médico-paciente
   actualizarEstadoMedicoPaciente(id_medpaci: number, estado: string): Observable<any> {
    const body = { id_medpaci, estado };
    return this.http.put<any>(`${this.baseUrl}/actualizarEstadoMedicoPaciente`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }


  //horarios en telemedicina consultar a la api por horarios por el id_medico

listarhorariosxid_medico(id_medico: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { id_medico: id_medico }; // Crea un objeto JSON con el id_usuario

 // console.log(id_medico); // Esto sigue siendo útil para depuración
  return this.http.post<any>(`${this.baseUrl}/listar_horar_tele`, body, { headers });
}




  Obtenerdatosmedicoxid(id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id_usuario }; // Aquí se envía el JSON con el id_usuario
    return this.http.post(`${this.baseUrl}/medicoxi`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  guardarAsisten(id_medicoss: number,id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //console.log(id_medicoss);
    const body = { id_medicoss, id_usuario }; // Aquí se envía el JSON con el id_usuario
    return this.http.post(`${this.baseUrl}/guardarasistente`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  //asistente
  Actualizarestadoasisten(actualizarestado: any): Observable<any> {
    //console.log(actualizarestado);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/editarasistente`, actualizarestado, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  vizualizarasistente(listarasistente: any): Observable<any> {
    //console.log(listarasistente);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/listarasistente`, listarasistente, { headers }).pipe(
      catchError(this.handleError)
    );
  }
/////obtener los pacientes del medico con el id_asistente
  obtenerAsistentespacientes(id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/pacientemed_asis`, { id_usuario }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /////obtener los datos fisicos de los pacientes
  octenerdatosfisicospaciente(id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/med_datosfisicos`, { id_usuario }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  actualizardatosfisicos(datosfisicosac: any): Observable<any> {
    //console.log(datosfisicosac);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/actualizarmed_datosfisicos`, datosfisicosac, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  vizualizarconsultas(listararconsul: any): Observable<any> {
   // console.log(listararconsul);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/LISTARCONSULTAS`, listararconsul, { headers }).pipe(
      catchError(this.handleError)
    );
  }



}


