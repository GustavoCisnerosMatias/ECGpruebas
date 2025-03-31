import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl = this.servg.URLAPI;
  private jsonURL = 'assets/BD/BD_estaturas.json';
  private jsonURLPeso = 'assets/BD/pesos.json'; 
  private usuarioActual: any | null = null;

  constructor(private router:Router,private http: HttpClient, private servg:GeneralService) { }
  
  obtenerEstaturas(): Observable<any> {
    return this.http.get<any>(this.jsonURL);
  }
  obtenerPesos(): Observable<any> {
    return this.http.get<any>(this.jsonURLPeso);
  }
  // Función para crear datos físicos
  crearDatosFisicos(datos: any): Observable<any> {
   // console.log('Datos a enviar para crear datos fisicos:', datos); 
    return this.http.post(`${this.baseUrl}/crear_datosfisicos`, datos);
  }

  // Función para crear dispositivo
  crearDispositivo(dispositivo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear_dispositivo`, dispositivo);
  }

  // Función para crear usuario
  crearUsuario(usuario: any): Observable<any> {
    //console.log('Datos a enviar para crear usuario:', usuario); 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/crear_usuario`, usuario, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 // Función para crear usuario asistente
 crearUsuarioasis(usuario: any): Observable<any> {
  //console.log('Datos a enviar para crear usuario:', usuario); 
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseUrl}/crear_user_asis`, usuario, { headers }).pipe(
    catchError(this.handleError)
  );
}
crear_usuariomedico(usuario: any): Observable<any> {
  //console.log('Datos a enviar para crear usuario:', usuario); 
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.baseUrl}/crear_usuariomedico`, usuario, { headers }).pipe(
    catchError(this.handleError)
  );
}

  
  // Función para editar usuario
  EditarUsuario(usuario: any): Observable<any> {
    //console.log('Datos a enviar para crear usuario:', usuario); 
    return this.http.post(`${this.baseUrl}/editar_usuario`, usuario);
  }


   // Función para editar estado de usuario
   EditarestadoUsuario(usuario: any): Observable<any> {
   // console.log('Datos a enviar para crear usuario:', usuario); 
    return this.http.post(`${this.baseUrl}/editar_estado`, usuario);
  }
 // Función para listar usuarios
 listarusuarios(): Observable<any> { 
  return this.http.get<any>(`${this.baseUrl}/listadoregistros`).pipe(
    catchError(error => {
      //console.error('Error al listar usuarios:', error);
      return throwError(error); // Reenvía el error para que pueda ser manejado en el componente
    })
  );
}



  //obtener telefono y correo por id
  obtenerDatosContacto(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Buscarxcedula_ide?id_usuario=${idUsuario}`);
  }

   // Implementación para obtener id_usuario por cédula en tu API
  obtenerIdUsuarioPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Buscarxcedula_id?cedula=${cedula}`);
    
  }
  

  

  setUsuarioActual(usuario: any) {
    this.usuarioActual = usuario;
    // Cifrar usuario antes de almacenarlo en localStorage
    const encryptedUsuario = CryptoJS.AES.encrypt(
      JSON.stringify(usuario),
      SECRET_KEY
    ).toString();
    
    // Guardar el usuario cifrado en localStorage
    localStorage.setItem('usuarioActual', encryptedUsuario);
  }

  getUsuarioActual(): any | null {
    // Si usuarioActual es null, intentar cargarlo desde localStorage
    if (!this.usuarioActual) {
      const encryptedUsuarioData = localStorage.getItem('usuarioActual');
      if (encryptedUsuarioData) {
        // Descifrar el usuario desde localStorage
        const bytes = CryptoJS.AES.decrypt(encryptedUsuarioData, SECRET_KEY);
        const decryptedUsuario = bytes.toString(CryptoJS.enc.Utf8);
        
        this.usuarioActual = decryptedUsuario ? JSON.parse(decryptedUsuario) : null;
      } else {
        this.usuarioActual = null;
      }
    }
    return this.usuarioActual;
  }


  
  obtenerImagenPerfil(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/listadoima?id_usuario=${idUsuario}`); 
  }
  // Nuevo método para agregar imagen
  agregarImagen(idUsuario: number, base64Foto: string): Observable<any> {
    const payload = {
      id_usuario: idUsuario,
      foto: base64Foto
    };
    return this.http.post<any>(`${this.baseUrl}/agregarima`, payload);
  }


//editar contraseña
editarContrasena(usuario: any): Observable<any> {
  // Construir el objeto usuarioActualizado con la contraseña en texto plano
  const usuarioActualizado = {
    id_usuario: usuario.id_usuario,
    contrasena_actual: usuario.contrasena_actual,
    nueva_contrasena: usuario.nueva_contrasena
  };

  return this.http.post<any>(`${this.baseUrl}/editar_contra`, usuarioActualizado)
    .pipe(
      catchError(this.handleError)
    );
}



  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio UsuariosService:', error);
    throw error;
  }

   // Función para editar usuario
   EditarUser(usuario: any): Observable<any> {
   // console.log('Datos a enviar para editar user:', usuario); 
    return this.http.post(`${this.baseUrl}/editar_user`, usuario);
  }

  actualizarDatosFisicos(datos: { id_usuario: string, peso?: number | null, estatura?: number | null }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/actualizarDatosFisicos`, datos);
  }

  cerrarSesion(): void {
    // Eliminar los datos almacenados en localStorage
    localStorage.removeItem('usuarioActual');
    this.usuarioActual = null;
    // Redirigir al usuario a la página de inicio de sesión o a otra página si es necesario
    this.router.navigate(['/login']);
  }
  // Función para editar usuario
  Recuperar_contraseña(recu: any): Observable<any> {
   // console.log('Datos a enviar para editar user:', recu); 
    return this.http.post(`${this.baseUrl}/recupe_contra`, recu);
  }
   // Función para editar usuario
   actualizar_contraseña(datosac: any): Observable<any> {
    //console.log('Datos a enviar para editar user:', datosac); 
    return this.http.post(`${this.baseUrl}/actualizarcontra`, datosac);
  }
  // Función para verificar correo
  verificar_correo(datocorreo: any): Observable<any> {
   // console.log('Datos a enviar para editar user:', datocorreo); 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/vericorreo`, datocorreo, { headers }).pipe(
    catchError(this.handleError)
  );
  }

  // Función para editar usuario
  Recuperar_usuario(recu: any): Observable<any> {
    //console.log('Datos a enviar para editar user:', recu); 
    return this.http.post(`${this.baseUrl}/recupe_contra`, recu);
  }
   // Función para editar usuario
   actualizar_usuario(datosac: any): Observable<any> {
   // console.log('Datos a enviar para editar user:', datosac); 
    return this.http.post(`${this.baseUrl}/actualizarusername`, datosac);
  }
   // Función para editar usuario
   cambiardispo(dispo: any): Observable<any> {
    //console.log('Datos a enviar para editar user:', dispo); 
    return this.http.post(`${this.baseUrl}/EDIlistar_dispositivo`, dispo);
  }
   // Función para editar usuario
   listar(datosac: any): Observable<any> {
   // console.log('Datos a enviar para editar user:', datosac); 
    return this.http.post(`${this.baseUrl}/listar_dispositivo`, datosac);
  }
  
  
}
