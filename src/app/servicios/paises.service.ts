import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private baseUrl = this.servg.URLAPI;

  constructor(private http: HttpClient,private servg:GeneralService) { }

  obtenerPaises(): Observable<{ pais: { id_pais: number, nombre_pais: string }[] }> {
    return this.http.get<{ pais: { id_pais: number, nombre_pais: string }[] }>(`${this.baseUrl}/listapais`);
  }

  obtenerProvincias(idPais: number): Observable<{ provincias: { id_provincia: number, nombre_provincia: string }[] }> {
    return this.http.post<{ provincias: { id_provincia: number, nombre_provincia: string }[] }>(`${this.baseUrl}/listaprovincias`, { id_pais: idPais });
  }

  obtenerCantones(idProvincia: number): Observable<{ cantones: { id_canton: number, nombre_canton: string }[] }> {
    return this.http.post<{ cantones: { id_canton: number, nombre_canton: string }[] }>(`${this.baseUrl}/listacantones`, { id_provincia: idProvincia });
  }
}
