import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AdministradorService } from 'src/app/servicios/administrador.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-informes-admin-medicos',
  templateUrl: './informes-admin-medicos.component.html',
  styleUrls: ['./informes-admin-medicos.component.scss'],
})
export class InformesAdminMedicosComponent implements OnInit {
    listaMedicos: any[] = [];
    medicosPorMes: { [key: string]: number } = {};
    meses: string[] = [];
    conteoMedicosPorMes: number[] = [];
    estadisticasPorMes: any[] = [];
    estadisticasPorAnio: any[] = [];
    totalMedicos: number = 0;
    anios: number[] = [];
    totalMedicosPorAnio: number[] = [];
    chart: any; // Declarar la variable del gráfico

    constructor(
      private router: Router,
      private administradorservice: AdministradorService,
      private toastController: ToastController
    ) {}

    ngOnInit() {
      this.obtenerMedicos();
    }

    obtenerMedicos() {
      this.administradorservice.lista_medicos().subscribe(
        (response) => {
          this.listaMedicos = response.medicos;
          this.generarEstadisticas();
        },
        (error) => {
          //console.error('Error al obtener la lista de médicos', error);
        }
      );
    }

    generarEstadisticas() {
      this.medicosPorMes = {};
      this.totalMedicos = 0;
    
      const anioActual = moment().year();
      const mesesNombre = moment.months();
    
      // Inicializar el conteo de médicos por mes
      mesesNombre.forEach((mes) => {
        this.medicosPorMes[mes] = 0; 
      });
    
      // Contar médicos por mes
      this.listaMedicos.forEach((medico) => {
        const fechaRegistro = moment(medico.fecha_registro);
        if (fechaRegistro.year() === anioActual) {
          const mes = fechaRegistro.format('MMMM');
          this.medicosPorMes[mes]++;
          this.totalMedicos++;
        }
      });
    
      // Crear un array de meses hasta el último mes registrado
      this.meses = [];
      const ultimoMesIndex = moment().month(); // Obtener el índice del mes actual (0-11)
      
      for (let i = 0; i <= ultimoMesIndex; i++) {
        this.meses.push(mesesNombre[i]); // Agregar meses hasta el actual
      }
    
      this.conteoMedicosPorMes = this.meses.map(
        (mes) => this.medicosPorMes[mes] // Obtener el conteo de médicos por mes
      );
    
      this.calcularEstadisticasDetalladas();
      this.calcularEstadisticasPorAnio();
      this.crearGrafico(); // Llama a crear gráfico aquí
    }
    
    
    calcularEstadisticasDetalladas() {
      let medicosAcumulados = 0;
      let medicosPrevioMes: number | null = null;
      let totalMedicosPrevioMes: number | null = null; // Variable para almacenar el total de médicos acumulados del mes anterior
    
      this.estadisticasPorMes = this.meses.map((mes) => {
        const medicosNuevos = this.medicosPorMes[mes];
        medicosAcumulados += medicosNuevos;
    
        let cambioMensual = '-';
        let tasaCrecimiento = '-'; // Nueva variable para la tasa de crecimiento
    
        // Calcular el cambio mensual en porcentaje
        if (medicosPrevioMes !== null) {
          cambioMensual = (
            ((medicosNuevos - medicosPrevioMes) / medicosPrevioMes) *
            100
          ).toFixed(2) + '%';
        }
    
        // Calcular la tasa de crecimiento en función del total acumulado
        if (totalMedicosPrevioMes !== null) {
          tasaCrecimiento = (
            ((medicosAcumulados - totalMedicosPrevioMes) / totalMedicosPrevioMes) *
            100
          ).toFixed(2) + '%';
        }
    
        // Actualizar las variables para el próximo mes
        medicosPrevioMes = medicosNuevos;
        totalMedicosPrevioMes = medicosAcumulados; // Actualiza el total de médicos acumulados del mes actual para el próximo mes
    
        return {
          mes,
          medicosNuevos,
          totalMedicos: medicosAcumulados,
          cambioMensual,
          tasaCrecimiento, // Añadir la tasa de crecimiento al objeto de estadística
        };
      });
    }
    

    calcularEstadisticasPorAnio() {
      const medicosPorAnio: { [key: number]: number } = {};
      let medicosAcumulados = 0;
      let medicosPrevioAnio: number | null = null;
      let totalMedicosPrevioAnio: number | null = null; 

      this.listaMedicos.forEach((medico) => {
        const fechaRegistro = moment(medico.fecha_registro);
        const anio = fechaRegistro.year();

        if (!medicosPorAnio[anio]) {
          medicosPorAnio[anio] = 0;
        }
        medicosPorAnio[anio]++;
      });

      this.anios = Object.keys(medicosPorAnio).map(anio => parseInt(anio));
      this.totalMedicosPorAnio = this.anios.map(anio => medicosPorAnio[anio]);

      this.estadisticasPorAnio = this.anios.map((anio) => {
        const medicosNuevos = medicosPorAnio[anio];
        medicosAcumulados += medicosNuevos;

        let cambioAnual = '-';
        let tasaCrecimiento = '-'; 

        if (medicosPrevioAnio !== null) {
          cambioAnual = (
            ((medicosNuevos - medicosPrevioAnio) / medicosPrevioAnio) *
            100
          ).toFixed(2) + '%';
        }

        if (totalMedicosPrevioAnio !== null) {
          tasaCrecimiento = (
            ((medicosAcumulados - totalMedicosPrevioAnio) / totalMedicosPrevioAnio) *
            100
          ).toFixed(2) + '%';
        }

        totalMedicosPrevioAnio = medicosAcumulados; 
        medicosPrevioAnio = medicosNuevos; 

        return {
          anio,
          medicosNuevos,
          totalMedicos: medicosAcumulados,
          cambioAnual,
          tasaCrecimiento,
        };
      });
    }

    crearGrafico() {
      const ctx = document.getElementById('medicosChart') as HTMLCanvasElement;

      if (this.chart) {
        this.chart.destroy(); // Destruir el gráfico anterior si existe
      }

      this.chart = new Chart(ctx, {
        type: 'bar', // Cambia esto a 'line' si quieres un gráfico de líneas
        data: {
          labels: this.meses,
          datasets: [{
            label: 'Médicos Registrados',
            data: this.conteoMedicosPorMes,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
}
