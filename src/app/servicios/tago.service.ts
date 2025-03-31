import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagoService {
  private apiUrl = 'https://api.tago.io/data'; // URL de la API de Tago.io

  constructor(private http: HttpClient) {}

  // Método para obtener datos de Tago.io pasando el token como parámetro
  getData(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': token, // Autenticación con el token de Tago.io
    });

    return this.http.get(this.apiUrl, { headers });
  }
}























/* import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagoService {
  private baseUrl = 'https://api.tago.io';  // URL de la API de Tago.io
  private token = '1525d430-e6fb-48c9-9f5a-0c4e5f3fff12';    // Reemplaza con tu token

  constructor(private http: HttpClient) {}
// Obtener datos en tiempo real sin 'Bearer'
getData(deviceId: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${this.token}`  // Solo el token, sin 'Bearer'
  });

  const url = `${this.baseUrl}/device/${deviceId}/data`;  // Endpoint para obtener datos

  return this.http.get(url, { headers });
}

}
 */
