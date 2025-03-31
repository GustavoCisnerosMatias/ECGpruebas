import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-cambiar-user',
  templateUrl: './cambiar-user.page.html',
  styleUrls: ['./cambiar-user.page.scss'],
})
export class CambiarUserPage implements OnInit {
  usuarioActual: any | null = null;
  cedula: string = '';
  nuevoUsername: string = '';
  mensaje: string = '';

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  cambiarUsername() {
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      const data = {
        id_usuario: this.usuarioActual.id_usuario,
        cedula: this.cedula,
        nuevo_username: this.nuevoUsername,
      };

      this.usuariosService.EditarUser(data).subscribe(
        (response) => {
          this.mensaje = response.mensaje;
          this.reiniciarMensaje(response.mensaje);
        },
        (error) => {
          this.mensaje = 'Error al cambiar el nombre de usuario';
          this.reiniciarMensaje(this.mensaje);
        }
      );
    } else {
      this.mensaje = 'Usuario no cargado';
      this.reiniciarMensaje(this.mensaje);
    }
  }

  reiniciarMensaje(mensaje: string) {
    if (mensaje === 'Usuario actualizado exitosamente') {
      setTimeout(() => {
        this.router.navigate(['/usuario']);
      }, 3000); // Redirige después de 3 segundos
    } else {
      setTimeout(() => {
        this.mensaje = '';
      }, 3000); // Reinicia el mensaje después de 3 segundos
    }
  }
}
