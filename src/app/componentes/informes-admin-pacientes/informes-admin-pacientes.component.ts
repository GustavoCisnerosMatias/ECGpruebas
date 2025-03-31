import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AdministradorService } from 'src/app/servicios/administrador.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-informes-admin-pacientes',
  templateUrl: './informes-admin-pacientes.component.html',
  styleUrls: ['./informes-admin-pacientes.component.scss'],
})
export class InformesAdminPacientesComponent  implements OnInit {

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
      this.administradorservice.lista_usuarios().subscribe(
        (response) => {
          this.listaMedicos = response.usuarios;
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
        const fechaRegistro = moment(medico.fecha_creacion);
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
          
          if (medicosPrevioMes === 0) {
            cambioMensual = medicosNuevos > 0 ? '100%' : '0%';
          }else {
            cambioMensual = (
              ((medicosNuevos - medicosPrevioMes) / medicosPrevioMes) *
              100
            ).toFixed(2) + '%';
          }
        }
    
        // Calcular la tasa de crecimiento en función del total acumulado
        if (totalMedicosPrevioMes !== null) {


          if (totalMedicosPrevioMes === 0 && medicosAcumulados > 0) {
            tasaCrecimiento = '100%'; // Mostrar 100% si el mes anterior es 0 y el actual es mayor que 0
          } else if (totalMedicosPrevioMes === 0 && medicosAcumulados === 0) {
            tasaCrecimiento = '0%'; // Mostrar 0% si ambos son 0
          } else {
            tasaCrecimiento = (
              ((medicosAcumulados - totalMedicosPrevioMes) / totalMedicosPrevioMes) *
              100
            ).toFixed(2) + '%';
          }
         
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
        const fechaRegistro = moment(medico.fecha_creacion);
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


    imprimir() {
      const printContent = document.getElementById('contenidoImprimir');
      if (printContent) {
        const printWindow = window.open('', '', 'height=600, width=800');
        printWindow?.document.write('<html><head><title>Reporte de la cantidad de pacientes</title>');
        
        // Agregar estilos para impresión
        printWindow?.document.write(`
          <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    ion-grid {
      width: 100%;
      display: block; /* Asegura que los grid se muestren como bloque */
    }
    ion-row {
      display: flex; /* Utiliza flexbox para una correcta distribución */
      flex-wrap: wrap; /* Permite que las columnas se ajusten */
    }
    ion-col {
      display: inline-block;
      width: 23%; /* Ajusta el ancho de cada columna para que no se desborden */
      padding: 5px;
      box-sizing: border-box; /* Asegura que el padding no afecte el tamaño */
      margin-bottom: 10px;
    }
    img {
      max-width: 100%;
      margin-bottom: 20px;
    }
    @media print {
      body {
        font-size: 12px;
      }
      table {
        page-break-before: always;
      }
      ion-grid {
        display: block;
      }
      ion-col {
        width: 23%; /* Ajusta el ancho para las columnas */
      }
    }
  </style>
        `);
    
        printWindow?.document.write('</head><body>');
        
        // Capturamos los gráficos solo una vez
        const charts = Array.from(printContent.getElementsByTagName('canvas'));
        charts.forEach((chart: HTMLCanvasElement) => {
          const image = chart.toDataURL('image/png');
          printWindow?.document.write(`<img src="${image}" style="max-width: 100%; margin-bottom: 20px;"/>`);
        });
    
        // Capturamos el contenido de las tablas de forma ordenada (sin duplicación)
        const tablas = Array.from(printContent.querySelectorAll('ion-grid'));
        let uniqueTables = new Set();
    
        tablas.forEach((tabla: HTMLElement) => {
          const tableClone = tabla.cloneNode(true) as HTMLElement;
          // Solo agregamos las tablas que aún no se han agregado
          if (!uniqueTables.has(tableClone.innerHTML)) {
            uniqueTables.add(tableClone.innerHTML);
            printWindow?.document.write(tableClone.outerHTML);
          }
        });
    
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.print();
      }
    }
    
    
    
    
    
    
}
