import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import * as moment from 'moment';
import { ChartData, ChartOptions, registerables, Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-ttl-pacientes',
  templateUrl: './reporte-ttl-pacientes.component.html',
  styleUrls: ['./reporte-ttl-pacientes.component.scss'],
})
export class ReporteTtlPacientesComponent implements OnInit {
  listaMedicos: any[] = [];
  usuarioActual: any | null = null;
  medicosPorUsuario: any[] = [];
  estadisticasPorAnio: any[] = [];
  pacientesPorMes: { [key: string]: number } = {}; // Ensure type safety
  meses: string[] = [];
  conteoPacientesPorMes: number[] = [];
  estadisticasPorMes: any[] = [];
  totalPacientes: number = 0;
  anios: number[] = [];
  totalPacientesPorAnio: number[] = [];
  
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.obtenerMedicos();
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual?.id_usuario) {
      this.obtenerPacientesPorUsuario(this.usuarioActual.id_usuario);
    }
  }

  obtenerMedicos() {
    this.medicoService.obtenerMedicos().subscribe(
      (response) => {
        this.listaMedicos = response.medicos;
      },
      (error) => {
        this.mostrarMensaje('Error al obtener la lista de médicos');
        console.error('Error al obtener la lista de médicos', error);
      }
    );
  }

  obtenerPacientesPorUsuario(id_usuario: number) {
    this.medicoService.obtenerpacientes(id_usuario).subscribe(
      (response) => {
        this.medicosPorUsuario = response;
        this.generarEstadisticas();
      },
      (error) => {
        this.mostrarMensaje('Error al obtener pacientes por usuario');
        console.error('Error al obtener pacientes por usuario', error);
      }
    );
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  generarEstadisticas() {
    this.pacientesPorMes = {};
    this.totalPacientes = 0;

    const anioActual = moment().year();
    let ultimoMesConDatos = -1;

    // Recorre la lista de médicos para contar pacientes por mes
    this.medicosPorUsuario.forEach(paciente => {
        const fechaRegistro = moment(paciente.fecha_registro);

        if (!fechaRegistro.isValid()) {
           // console.error(`Fecha inválida: ${paciente.fecha_registro}`);
            return;
        }

        if (fechaRegistro.year() === anioActual) {
            const mes = fechaRegistro.month(); // Obtiene el índice del mes (0 para enero, 11 para diciembre)
            const mesNombre = fechaRegistro.format('MMMM YYYY');
            this.pacientesPorMes[mesNombre] = (this.pacientesPorMes[mesNombre] || 0) + 1;
            this.totalPacientes++;

            // Actualiza el último mes con datos
            if (mes > ultimoMesConDatos) ultimoMesConDatos = mes;
        }
    });

    // Genera los nombres de los meses del año hasta el último mes con datos
    const mesesDelAnio = moment.months();
    this.meses = mesesDelAnio.slice(0, ultimoMesConDatos + 1)
                              .map((mes, i) => `${mes} ${anioActual}`);

    // Completa los meses que no tienen datos con 0
    this.conteoPacientesPorMes = this.meses.map(mes => this.pacientesPorMes[mes] || 0);

   // console.log('Conteo de pacientes por mes:', this.conteoPacientesPorMes);

    this.calcularEstadisticasDetalladas();
    this.calcularTotalPacientesPorAnio();
    this.calcularEstadisticasPorAnio();
}

calcularEstadisticasDetalladas() {
  let pacientesAcumulados = 0;
  let pacientesPrevioMes: number | null = null;

  this.estadisticasPorMes = this.meses.map((mes, index) => {
      const pacientesNuevos = this.conteoPacientesPorMes[index];
      pacientesAcumulados += pacientesNuevos;

      const cambioMensual = pacientesPrevioMes !== null 
          ? (pacientesPrevioMes === 0 && pacientesNuevos === 0) 
              ? '0.00%'  // Si tanto el mes anterior como el actual son 0, asignamos 0.00%
              : pacientesPrevioMes === 0 
                  ? '100%'  // Si el mes anterior es 0 y el actual no, asignamos 100%
                  : (((pacientesNuevos - pacientesPrevioMes) / pacientesPrevioMes) * 100).toFixed(2) + '%'
          : '-';
      
      pacientesPrevioMes = pacientesNuevos;

      return {
          mes,
          pacientesNuevos,
          totalPacientes: pacientesAcumulados,
          cambioMensual
      };
  });
}

  calcularTotalPacientesPorAnio() {
    const pacientesPorAnio: { [key: number]: number } = {};

    this.medicosPorUsuario.forEach(paciente => {
      const fechaRegistro = moment(paciente.fecha_registro);
      const anio = fechaRegistro.year();

      if (!pacientesPorAnio[anio]) {
        pacientesPorAnio[anio] = 0;
      }

      pacientesPorAnio[anio]++;
    });

    this.anios = Object.keys(pacientesPorAnio).map(Number);
    this.totalPacientesPorAnio = this.anios.map(anio => pacientesPorAnio[anio]);
  }

  calcularEstadisticasPorAnio() {
    const pacientesPorAnio: { [key: number]: number } = {};
    let pacientesAcumulados = 0;
    let pacientesPrevioAnio: number | null = null;

    this.medicosPorUsuario.forEach(paciente => {
        const fechaRegistro = moment(paciente.fecha_registro);
        const anio = fechaRegistro.year();

        if (!pacientesPorAnio[anio]) {
            pacientesPorAnio[anio] = 0;
        }

        pacientesPorAnio[anio]++;
    });

    this.estadisticasPorAnio = Object.keys(pacientesPorAnio).map(anioStr => {
        const anio = Number(anioStr);
        const pacientesNuevos = pacientesPorAnio[anio];
        pacientesAcumulados += pacientesNuevos;

        // Cálculo de la tasa de crecimiento poblacional anual usando la fórmula
        let cambioAnual: string | number = '-';
        if (pacientesPrevioAnio !== null) {
            const P_x = pacientesAcumulados; // Población en el año final
            const P_0 = pacientesPrevioAnio; // Población en el año inicial
            const t = 1; // Suponiendo que estamos calculando para un año

            // Aplicar la fórmula
            const tasaCrecimiento = ((P_x / P_0) ** (1 / t) - 1) * 100;
            cambioAnual = tasaCrecimiento.toFixed(2) + '%'; // Formato de porcentaje
        }

        // Actualizar pacientesPrevioAnio al total acumulado
        pacientesPrevioAnio = pacientesAcumulados;

        return {
            anio,
            pacientesNuevos,
            totalPacientes: pacientesAcumulados,
            cambioAnual
        };
    });
}


}
