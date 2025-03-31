import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.page.html',
  styleUrls: ['./crear-usuarios.page.scss'],
})
export class CrearUsuariosPage implements OnInit {
  pasoActual: string = 'usuario';
  usuario: any = {};
  datosFisicos: any = {};
  dispositivo: any = {};

  constructor(
    private router: Router,
    private storage: Storage,
    private usuariosService: UsuariosService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
  }
  // Método para mostrar una alerta
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  avanzarAlSiguientePaso(datos: any) {
    if (this.pasoActual === 'usuario') {
      this.usuario = datos;
      //console.log('Datos del usuario:', this.usuario);
      this.pasoActual = 'dispositivo';
    } /* else if (this.pasoActual === 'datosFisicos') {
      this.datosFisicos = datos;
      //console.log('Datos físicos:', this.datosFisicos);
      this.pasoActual = 'dispositivo';
    } */
  }

  async registrarCliente(datosDispositivo: any) {
    this.dispositivo = datosDispositivo;
    //console.log('Datos del dispositivo:', this.dispositivo);
  
    try {
      // Crear el usuario y obtener la respuesta con el id_usuario
      const response: any = await this.usuariosService.crearUsuario(this.usuario).toPromise();
      const idUsuario = response.id_usuario;
  
      // Asignar el id_usuario tanto a datosFisicos como a dispositivo
      this.datosFisicos.id_usuario = idUsuario;
      this.dispositivo.id_usuario = idUsuario;
  
      // Enviar los datos físicos y del dispositivo
     // this.enviarDatosFisicos(this.datosFisicos);
      this.enviarDispositivo(this.dispositivo);
      // Mostrar mensaje de éxito antes de redirigir
      await this.mostrarAlerta('Éxito', 'Usuario creado exitosamente.');
      // Redirigir a la página de autenticación
      this.router.navigate(['/autentificacion']);
    } catch (error) {
      this.mostrarAlerta('Error', 'Hubo un problema al crear el usuario.');
      console.error('Error al crear usuario:', error);
    }
  }
  

/*   async enviarDatosFisicos(datosFisicos: any) {
    this.usuariosService.crearDatosFisicos(datosFisicos).subscribe(
      (response) => {
     //   console.log('Datos físicos creados:', response);
      },
      (error) => {
        console.error('Error al crear datos físicos:', error);
      }
    );
  } */

  async enviarDispositivo(dispositivo: any) {
    this.usuariosService.crearDispositivo(dispositivo).subscribe(
      (response) => {
        //console.log('Dispositivo creado:', response);
      },
      (error) => {
        console.error('Error al crear dispositivo:', error);
      }
    );
  }

  retrocederAlPasoAnterior() {
    if (this.pasoActual === 'dispositivo') {
      this.pasoActual = 'usuario';
    } /* else if (this.pasoActual === 'dispositivo') {
      this.pasoActual = 'dispositivo';
    } */
  }
}
