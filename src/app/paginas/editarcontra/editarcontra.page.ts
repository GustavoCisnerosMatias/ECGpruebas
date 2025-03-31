import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-editarcontra',
  templateUrl: './editarcontra.page.html',
  styleUrls: ['./editarcontra.page.scss'],
})
export class EditarcontraPage implements OnInit {
  usuarioActual: any | null = null;
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  verificarNuevaContrasena: string = '';
  showPassword: boolean = false; // Variable para mostrar/ocultar la contraseña

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
      // Manejar el caso donde no se pueda cargar el usuario actual
      //console.error('No se pudo cargar el usuario actual');
      // Aquí podrías redirigir o mostrar un mensaje de error
    }
  }

  validarContrasena() {
    if (this.nuevaContrasena.length < 8) {
      this.mostrarToast('La contraseña debe tener al menos 8 caracteres');
    }
  }

  validarNuevaContrasena() {
    if (this.nuevaContrasena !== this.verificarNuevaContrasena) {
      this.mostrarToast('Las contraseñas no coinciden');
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  actualizarContrasena() {
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      const usuario = {
        id_usuario: this.usuarioActual.id_usuario,
        contrasena_actual: this.contrasenaActual,
        nueva_contrasena: this.nuevaContrasena // Enviar la contraseña encriptada
      };

      // Llamar al servicio para actualizar la contraseña
      this.usuariosService.editarContrasena(usuario).subscribe(
        (response) => {
          if (response && response.mensaje === 'Contraseña actualizada exitosamente') {
            //console.log('Contraseña actualizada exitosamente');
            this.mostrarToast('Contraseña actualizada exitosamente');
            // Aquí podrías redirigir o hacer cualquier otra acción después de actualizar
          } else {
            //console.error('Error en la respuesta de la API al actualizar la contraseña');
            this.mostrarToast('Error al actualizar la contraseña');
          }
        },
        (error) => {
          //console.error('Error al actualizar la contraseña:', error);
          this.mostrarToast('Error al actualizar la contraseña');
          // Aquí podrías manejar errores específicos si es necesario
        }
      );
    } else {
      // Manejar el caso donde no se tenga el usuario actual
      //console.error('No se pudo obtener el usuario actual');
      this.mostrarToast('Error: No se pudo obtener el usuario actual');
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}


