import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-autentificacion',
  templateUrl: './autentificacion.page.html',
  styleUrls: ['./autentificacion.page.scss'],
})
export class AutentificacionPage {
  username: string = '';
  contrasena: string = '';
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(
    private authService: SerAutentificacionService,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  login() {
    if (!this.username || !this.contrasena) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña.';
      return;
    }

    this.authService.authenticate(this.username, this.contrasena).subscribe({
      next: (response) => {
        //console.log('Respuesta del servidor:', response);
        if (response.mensaje === 'Autenticación exitosa') {
          if (response.id_rol === 2 || response.id_rol === 1|| response.id_rol === 3|| response.id_rol === 4) {
            const usuario = { nombre: response.nombre, id_usuario: response.id_usuario };
            this.usuariosService.setUsuarioActual(usuario);
            this.router.navigate(['/inicio']);
          } else {
            this.errorMessage = 'No tienes permisos para acceder.';
          }
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (err) => {
        //console.error('Error de autenticación:', err);
        this.errorMessage = 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    });
  }

  registerFirstTimeUser() {
    this.router.navigate(['/crear-usuarios']);
  }
  registerFirstTimeMedic() {
    this.router.navigate(['/crearmedicos']);

  }
  recuperarusuario() {
    this.router.navigate(['/recuperar-username']);

  }

  forgotCredentials() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
