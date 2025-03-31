import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IMenu, Datosfisicos, ITopic } from '../interfaces/interface';
import { UsuariosService } from './usuarios.service';
import { GeneralService } from './general.service';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = '1234Proyectoiot*'; // Cambia esto por una clave secreta más segura

interface AuthResponse {
  mensaje: string;
  id_rol: number;
  nombre: string;
  id_usuario: number;
  menu: IMenu[];
  topic: ITopic[];
  peso: Datosfisicos[];
}

@Injectable({
  providedIn: 'root',
})
export class SerAutentificacionService {
  private apiUrl = this.servg.URLAPI + '/login';
  public menu: IMenu[] = [];
  public Topic: ITopic[] = [];
  public datosfisicos: Datosfisicos[] = [];
  public idRol: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private usuariosService: UsuariosService,
    private servg: GeneralService
  ) {
    // Recuperar datos de localStorage cuando el servicio se inicializa
    this.loadFromLocalStorage();
  }

  authenticate(username: string, contrasena: string): Observable<AuthResponse> {
    // Limpiar los datos del almacenamiento local antes de hacer la autenticación
    this.clearPreviousData();

    const body = new FormData();
    body.append('username', username);
    body.append('contrasena', contrasena);

    return this.http.post<AuthResponse>(this.apiUrl, body).pipe(
      map((response) => {
        if (response.mensaje === 'Autenticación exitosa') {
          // Almacenar el menú y otros datos en las propiedades del servicio
          this.menu = response.menu;
          this.Topic = response.topic;
          this.datosfisicos = response.peso;
          this.idRol = response.id_rol;

          // Guardar los datos en localStorage de forma segura
          this.saveToLocalStorage();
        }
        return response;
      }),
      catchError((error) => {
        return of({
          mensaje: 'Error en la autenticación!',
          id_rol: 0,
          nombre: '',
          id_usuario: 0,
          menu: [],
          peso: [],
          topic: [],
        });
      })
    );
  }


  private saveToLocalStorage() {
    // Cifrar los datos antes de guardarlos en localStorage
    const encryptedMenu = CryptoJS.AES.encrypt(
      JSON.stringify(this.menu),
      SECRET_KEY
    ).toString();
    const encryptedTopic = CryptoJS.AES.encrypt(
      JSON.stringify(this.Topic),
      SECRET_KEY
    ).toString();
    const encryptedDatosFisicos = CryptoJS.AES.encrypt(
      JSON.stringify(this.datosfisicos),
      SECRET_KEY
    ).toString();
    const encryptedIdRol = CryptoJS.AES.encrypt(
      JSON.stringify(this.idRol),
      SECRET_KEY
    ).toString();

    localStorage.setItem('menu', encryptedMenu);
    localStorage.setItem('Topic', encryptedTopic);
    localStorage.setItem('datosfisicos', encryptedDatosFisicos);
    localStorage.setItem('idRol', encryptedIdRol);
  }

  private loadFromLocalStorage() {
    try {
      const storedMenu = localStorage.getItem('menu');
      const storedDatosFisicos = localStorage.getItem('datosfisicos');
      const storedIdRol = localStorage.getItem('idRol');
      const storedTopic = localStorage.getItem('Topic');

      // Solo cargar desde localStorage si los datos existen
      if (storedMenu && storedDatosFisicos && storedIdRol && storedTopic) {
        // Intentar descifrar los datos al cargarlos desde localStorage
        this.menu = JSON.parse(
          CryptoJS.AES.decrypt(storedMenu, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
        this.datosfisicos = JSON.parse(
          CryptoJS.AES.decrypt(storedDatosFisicos, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
        this.idRol = JSON.parse(
          CryptoJS.AES.decrypt(storedIdRol, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
        this.Topic = JSON.parse(
          CryptoJS.AES.decrypt(storedTopic, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
      } else {
        // Si no hay datos, cerrar sesión
        this.logout();
      }
    } catch (error) {
      // Si ocurre un error al descifrar, cerrar sesión
      this.logout();
    }
  }



  private clearPreviousData() {
    // Limpiar todos los datos de localStorage
    localStorage.removeItem('menu');
    localStorage.removeItem('datosfisicos');
    localStorage.removeItem('idRol');
    localStorage.removeItem('Topic');

    // Limpiar los datos almacenados en las propiedades del servicio
    this.menu = [];
    this.datosfisicos = [];
    this.idRol = null;
    this.Topic = [];
  }

  logout() {
    this.usuariosService.cerrarSesion();
    // Limpiar todos los datos de localStorage
    localStorage.removeItem('menu');
    localStorage.removeItem('datosfisicos');
    localStorage.removeItem('idRol');
    localStorage.removeItem('Topic');

    // Limpiar los datos almacenados en las propiedades del servicio
    this.menu = [];
    this.datosfisicos = [];
    this.idRol = null;
    this.Topic = [];

    // Llamar al método para cerrar la sesión del servicio de usuario

    //console.log('Datos en localStorage al cerrar sesión:', localStorage);

    // Navegar a la página de autenticación y reemplazar la URL actual para evitar volver atrás
    this.router.navigateByUrl('/autentificacion', { replaceUrl: true });
  }


  // Método para obtener los tópicos
  getTopics(): ITopic[] {
    return this.Topic;
  }
}
