import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiardispositivo',
  templateUrl: './cambiardispositivo.page.html',
  styleUrls: ['./cambiardispositivo.page.scss'],
})
export class CambiardispositivoPage implements OnInit {
  usuarioActual: any | null = null;
  pasoActual: string = '';
  enableButtom: string = '';
  dispositivo: any = null; // Variable para almacenar los datos del dispositivo
  dispositivoEditado: any = {}; // Variable para almacenar el dispositivo que se está editando
  aceptaCondiciones: boolean = false;
  aceptaPolitica: boolean = false;
  constructor(
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }
  Dispositivo(){
    this.pasoActual='creardispositivo';
    this.enableButtom='';

  }
  cancelar(){
    this.pasoActual='';

    this.enableButtom='disable';

  }
  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.listarDispositivo();
    } else {
      console.error('No se pudo cargar el usuario actual');
    }
  }

  listarDispositivo() {
    const datos = { id_usuario: this.usuarioActual.id_usuario };
    this.usuariosService.listar(datos).subscribe(
      (response) => {
        if (response && response.dispositivos && response.dispositivos.length > 0) {
          this.dispositivo = response.dispositivos[0];
          // Inicializar dispositivoEditado con los valores actuales del dispositivo
          this.dispositivoEditado = { ...this.dispositivo };
        } else {
        //  console.error('No se encontraron dispositivos para este usuario');
        this.enableButtom='disable';
        }
      },
      (error) => {
        console.error('Error al listar el dispositivo:', error);
      }
    );
  }
  añadirDispositivo(){

  }
  esFormularioValido() {
    return (
      this.dispositivo.codigo.trim() !== '' &&
      this.dispositivo.nombre.trim() !== '' &&
      this.aceptaCondiciones &&
      this.aceptaPolitica
    );
  }
  redirigirCondiciones() {
    this.router.navigate(['/proteciondedatos']);
  }

  redirigirPolitica() {
    this.router.navigate(['/politicas']);
  }

  // actualizarDispositivo() {
  //   const datosEditados = {
  //     id_usuario: this.usuarioActual.id_usuario,
  //     id_dispo: this.dispositivoEditado.id_dispo,
  //     nombre: this.dispositivoEditado.nombre,
  //     codigo: this.dispositivoEditado.codigo,
  //   };

  //   this.usuariosService.cambiardispo(datosEditados).subscribe(
  //     (response) => {
  //       //console.log('Dispositivo actualizado con éxito:', response);
  //       // Mostrar el mensaje de la API en un alert y redirigir a /inicio
  //       this.mostrarAlerta(response.mensaje);
  //     },
  //     (error) => {
  //       console.error('Error al actualizar el dispositivo:', error);
  //     }
  //   );
  // }
  actualizarDispositivo() {
    this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas actualizar el dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.procesarActualizacion();
          },
        },
      ],
    }).then(alert => alert.present());
  }

  procesarActualizacion() {
    const datosEditados = {
      id_usuario: this.usuarioActual.id_usuario,
      id_dispo: this.dispositivoEditado.id_dispo,
      nombre: this.dispositivoEditado.nombre,
      codigo: this.dispositivoEditado.codigo,
    };

    this.usuariosService.cambiardispo(datosEditados).subscribe(
      (response) => {
        this.mostrarAlerta(response.mensaje);
      },
      (error) => {
        console.error('Error al actualizar el dispositivo:', error);
        this.mostrarAlerta('Error al actualizar el dispositivo:'+ error.
          statusText);
      }
    );
  }


  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Actualización',
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Redirigir a la página de inicio
            this.router.navigate(['/inicio']);
          },
        },
      ],
    });

    await alert.present();
  }
}
