import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController
@Component({
  selector: 'app-editartodousuario',
  templateUrl: './editartodousuario.page.html',
  styleUrls: ['./editartodousuario.page.scss'],
})
export class EditartodousuarioPage implements OnInit {
  usuario: any = {}; // Inicializa como un objeto vacío

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private router: Router,
    private alertController: AlertController // Inyectar AlertController

  ) {}

  async ngOnInit() {
   
    this.route.paramMap.subscribe(params => {
      const idUsuario = +params.get('id')!;
      if (idUsuario) {
        this.obtenerDatosContactoUsuario(idUsuario);
      } else {
        //console.error('ID de usuario no proporcionado');
      }
    });
  }
  obtenerDatosContactoUsuario(idUsuario: number) {
    this.usuariosService.obtenerDatosContacto(idUsuario).subscribe(
      (response: any) => {
        if (response) {
          this.usuario = {
            id_usuario: response.id_usuario,
            cedula: response.cedula,
            nombre: response.nombre,
            apellido: response.apellido,
            id_rol: response.id_rol,
            username: response.username,
            estado: response.estado,
            correo_electronico: response.correo_electronico,
            telefono: response.telefono
          };
        }
      },
      (error) => {
        //console.error('Error al obtener datos de contacto:', error);
      }
    );
  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  

  guardarCambios() {
    this.usuariosService.EditarestadoUsuario(this.usuario).subscribe({
      next: (response: any) => {
        this.presentAlert(response.mensaje);
        if (response.mensaje === 'Usuario actualizado exitosamente') {
          this.router.navigate(['/inicio']);
        } else {
          //console.error('Error al editar usuario:', response.mensaje);
        }
      },
      error: (err) => {
        //console.error('Error al editar usuario:', err);
      }
    });
  }
}
