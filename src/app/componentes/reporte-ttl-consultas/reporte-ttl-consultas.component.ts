import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import * as moment from 'moment';
import { ChartData, ChartOptions, registerables, Chart } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reporte-ttl-consultas',
  templateUrl: './reporte-ttl-consultas.component.html',
  styleUrls: ['./reporte-ttl-consultas.component.scss'],
})
export class ReporteTtlConsultasComponent implements OnInit {
  usuarioActual: any | null = null;
  consultasPorMes: { mes: string; cantidad: number }[] = [];
  fechaInicio: string = '';  // Almacena la fecha de inicio
  fechaFin: string = '';     // Almacena la fecha de fin
  pacientes: { nombre: string; apellido: string; cedula: string; cantidad: number }[] = [];

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Consultas',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
      },
    ],
  };
  
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mes',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Consultas',
        },
      },
    },
  };

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  cargarConsultas() {
    if (this.usuarioActual?.id_usuario && this.fechaInicio && this.fechaFin) {
      const formattedFechaInicio = moment(this.fechaInicio).format('YYYY-MM-DD');
      const formattedFechaFin = moment(this.fechaFin).format('YYYY-MM-DD');
      this.obtenerConsultas(this.usuarioActual.id_usuario, formattedFechaInicio, formattedFechaFin);
    } else {
      this.mostrarToast('Por favor, ingrese las fechas de inicio y fin.');
    }
  }

  obtenerConsultas(id_usuario: number, fecha_ini: string, fecha_fin: string) {
    this.medicoService.vizualizarconsultas({
      id_usuario,
      fecha_ini,
      fecha_fin,
    }).subscribe((response) => {
     // console.log(response); // Agrega esto para verificar la respuesta
      this.processConsultas(response.consultas);
    });
  }
  
  processConsultas(consultas: any[]) {
    const consultasPorMes: { [key: string]: number } = {};
    const pacientesContador: { [key: string]: { nombre: string; apellido: string; cedula: string; cantidad: number } } = {};
    const allMonths = moment.months(); // Obtiene todos los nombres de los meses
  
    // Contar la cantidad de consultas por mes
    consultas.forEach(consulta => {
      const mes = moment(consulta.fecha_consulta).format('MMMM YYYY');
      
      // Contar la cantidad de consultas por mes
      if (!consultasPorMes[mes]) {
        consultasPorMes[mes] = 0;
      }
      consultasPorMes[mes]++;

      // Contar la cantidad de consultas por paciente
      const keyPaciente = `${consulta.id_paciente}-${consulta.cedula}`; // Crear una clave única para cada paciente
      if (!pacientesContador[keyPaciente]) {
        pacientesContador[keyPaciente] = {
          nombre: consulta.nombre,
          apellido: consulta.apellido,
          cedula: consulta.cedula,
          cantidad: 0,
        };
      }
      pacientesContador[keyPaciente].cantidad++;
    });
  
    // Asignar 0 a los meses que no tengan datos
    this.consultasPorMes = allMonths.map((mes) => {
      const mesAno = moment().month(mes).startOf('month').format('MMMM YYYY');
      return {
        mes: mesAno,
        cantidad: consultasPorMes[mesAno] || 0, // Asignar 0 si no hay datos
      };
    });
  
    // Determinar el último mes con datos
    const lastMonthWithData = Object.keys(consultasPorMes).reduce((last, current) => {
      return consultasPorMes[current] > 0 ? current : last;
    }, '');
  
    // Filtrar para obtener solo los meses hasta el último mes con datos
    const lastMonthIndex = allMonths.findIndex(m => moment().month(m).startOf('month').format('MMMM YYYY') === lastMonthWithData);
    
    // Solo conservar los meses hasta el último que tiene datos
    this.consultasPorMes = this.consultasPorMes.slice(0, lastMonthIndex + 1);
  
    // Actualizar datos para el gráfico
    this.lineChartData.labels = this.consultasPorMes.map(item => item.mes);
    this.lineChartData.datasets[0].data = this.consultasPorMes.map(item => item.cantidad);

    // Convertir el contador de pacientes a un arreglo
    this.pacientes = Object.values(pacientesContador);
  }
  
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
