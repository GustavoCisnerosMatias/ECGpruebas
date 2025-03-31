import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  usuarioActual: any | null = null; // Usa la interfaz Usuario aquí
  fotoSeleccionada: File | null = null;
  datosContacto: { correo_electronico: string, telefono: string } = {
    correo_electronico: '',
    telefono: ''
  };

  constructor( private serAutentificacion: SerAutentificacionService,private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.obtenerImagenPerfilUsuario(this.usuarioActual.id_usuario);
      this.obtenerDatosContactoUsuario(this.usuarioActual.id_usuario);
    }
  }
  ionViewWillEnter() {
    this.cargarUsuarioActual();
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
        console.error('Error al obtener datos de contacto:', error);
      }
    );
  }

  obtenerImagenPerfilUsuario(idUsuario: number) {
    this.usuariosService.obtenerImagenPerfil(idUsuario).subscribe(
      (response: any) => {
        if (response && response.foto) {
          this.usuarioActual.foto = 'data:image/jpeg;base64,' + response.foto; // Asigna la URL base64 de la foto al usuarioActual
        }
      },
      (error) => {
        console.error('Error al obtener imagen de perfil:', error);
      }
    );
  }

  // Método para seleccionar una nueva foto
  seleccionarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1]; // Eliminar el encabezado de la base64
        this.usuarioActual.foto = e.target.result; // Mostrar la imagen seleccionada
        this.enviarFoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  enviarFoto(base64String: string) {
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.usuariosService.agregarImagen(this.usuarioActual.id_usuario, base64String).subscribe(
        (response) => {
         // console.log('Foto subida exitosamente');
        },
        (error) => {
          //console.error('Error al subir la foto:', error);
        }
      );
    }
  }

  Editarcontacto() {
    this.router.navigate(['/editar-user']);
  }
  
  cambiarUsuario() {
    this.router.navigate(['/cambiar-user']);
  }

  cambiarContrasena() {
    this.router.navigate(['/editarcontra']);
  }
  datospersonales(){
    this.router.navigate(['/proteciondedatos']);
  }
  politicas(){
    this.router.navigate(['/politicas']);
  }

  salir() {
    // Lógica de cierre de sesión
    this.serAutentificacion.logout();

    // Redirigir a la página de inicio de sesión
    this.router.navigate(['/autentificacion']).then(() => {
      // Bloquear la navegación hacia atrás
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
      };
    });
  }
}
