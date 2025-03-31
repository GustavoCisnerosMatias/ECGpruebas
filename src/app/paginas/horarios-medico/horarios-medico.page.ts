import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { MedicoService } from 'src/app/servicios/medico.service'; // Asegúrate de que MedicoService esté importado
import { AlertController } from '@ionic/angular'; // Importa AlertController
@Component({
  selector: 'app-horarios-medico',
  templateUrl: './horarios-medico.page.html',
  styleUrls: ['./horarios-medico.page.scss'],
})
export class HorariosMedicoPage implements OnInit {
  usuarioActual: any | null = null;
  horarios: any[] = [];
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private messageService: GeneralService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.listarHorarios();
    }
  }

  listarHorarios() {
    this.medicoService.listarhorarios(this.usuarioActual.id_usuario).subscribe(
      (data) => {
        console.log('Horarios recibidos:', data); // Verifica qué datos llegan
        this.horarios = data.horarios; // Extrae la lista de horarios
      },
      (error) => {
        console.error('Error al listar horarios', error);
        this.mensajeError = 'Error al cargar los horarios.';
      }
    );
  }

  async editarHorario(horario: any) {
    this.medicoService.editardatosHorarios(horario).subscribe(
      async (response) => {
        this.mensajeExito = 'Horario actualizado correctamente.';
        await this.mostrarAlerta('Éxito', response.mensaje); // Muestra alerta con mensaje de éxito
        this.listarHorarios(); // Refresca la lista de horarios después de editar
      },
      async (error) => {
        //console.error('Error al editar horario', error);
        this.mensajeError = 'Error al actualizar el horario.';
        await this.mostrarAlerta('Error', this.mensajeError); // Muestra alerta con mensaje de error
      }
    );
  }

  // Método para mostrar alertas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
