import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.page.html',
  styleUrls: ['./editar-user.page.scss'],
})
export class EditarUserPage implements OnInit {
  usuarioActual: any | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';

  datosContacto: { correo_electronico: string, telefono: string } = {
    correo_electronico: '',
    telefono: ''
  };

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private messageService: GeneralService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.obtenerDatosContactoUsuario(this.usuarioActual.id_usuario);
    }
  }

  obtenerDatosContactoUsuario(idUsuario: number) {
    this.usuariosService.obtenerDatosContacto(idUsuario).subscribe(
      (response: any) => {
        if (response) {
          this.datosContacto = {
            correo_electronico: response.correo_electronico,
            telefono: response.telefono
          };
        }
      },
      (error) => {
       // console.error('Error al obtener datos de contacto:', error);
      }
    );
  }

  editarPerfil() {
    if (this.usuarioActual && this.datosContacto) {
      const usuarioEditado = {
        id_usuario: this.usuarioActual.id_usuario,
        correo_electronico: this.datosContacto.correo_electronico,
        telefono: this.datosContacto.telefono
      };

      this.usuariosService.EditarUsuario(usuarioEditado).subscribe(
        (response) => {
          if (response && response.mensaje) {
            this.messageService.mostrarMensajeExito('Editado exitosamente');
            
            // Esperar 3 segundos antes de redirigir
            setTimeout(() => {
              this.router.navigate(['/usuario']);
            }, 1000);
          }
        },
        (error) => {
          //console.error('Error al editar el perfil:', error);
          if (error.error && error.error.mensaje) {
            this.messageService.mostrarMensajeError('Error al editar el perfil: ' + error.error.mensaje);
          } else {
            this.messageService.mostrarMensajeError('Error inesperado al editar el perfil. Por favor, inténtalo de nuevo más tarde.');
          }
        }
      );
    }
  }

  limpiarMensajes() {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
