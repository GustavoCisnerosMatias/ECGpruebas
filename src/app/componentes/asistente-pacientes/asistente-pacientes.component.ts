import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { DatosFisicosResponse, pacientes } from 'src/app/interfaces/interface'; // Importamos las interfaces
import { MedicoService } from 'src/app/servicios/medico.service';



@Component({
  selector: 'app-asistente-pacientes',
  templateUrl: './asistente-pacientes.component.html',
  styleUrls: ['./asistente-pacientes.component.scss'],
})
export class AsistentePacientesComponent implements OnInit {
  paciente: pacientes | null = null;
  datosFisicos: any = {}; // Almacena peso y estatura
  editable: boolean = false; // Controla si los campos son editables

  constructor(
    private router: Router,
    private medicoService: MedicoService, // Servicio para la API
    private alertController: AlertController // Para mostrar alertas
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.paciente = navigation?.extras?.state?.["paciente"] || null;

    if (!this.paciente) {
      //console.error('No se recibió información del paciente');
    }

    // Cargar los datos físicos del paciente al iniciar la página
    this.cargarDatosFisicos();
  }

  habilitarEdicion() {
    this.editable = !this.editable; // Habilita o deshabilita la edición
  }
   // Calcula la edad a partir de la fecha de nacimiento
   calcularEdad(fechaNacimiento: string): number {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNacimientoDate.getMonth();
    
    // Ajustar si aún no ha llegado el cumpleaños
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
      edad--;
    }
    
    return edad;
  }

  cargarDatosFisicos() {
    if (this.paciente) {
      this.medicoService.octenerdatosfisicospaciente(this.paciente.id_usuario).subscribe(
        (response: any) => {
          this.datosFisicos = response.datosfisicos[0]; // Cargar datos físicos (peso y estatura)
        },
        (error) => {
         // console.error('Error al obtener los datos físicos:', error);
        }
      );
    }
  }

  guardarDatosFisicos() {
    // Prepara los datos actualizados
    const datosActualizados = {
      id_usuario: this.paciente?.id_usuario,
      peso: parseFloat(this.datosFisicos.peso),
      estatura: parseFloat(this.datosFisicos.estatura)
    };

    this.medicoService.actualizardatosfisicos(datosActualizados).subscribe(
      async (response) => {
        // Mostrar una alerta de confirmación
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Los datos físicos han sido actualizados correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        // Deshabilitar la edición después de guardar
        this.editable = false;
      },
      (error) => {
        //console.error('Error al actualizar los datos físicos:', error);
      }
    );
  }
}
