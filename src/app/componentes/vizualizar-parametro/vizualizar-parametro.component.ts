
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParametrosService } from 'src/app/servicios/parametros.service';
import { DatoBiome } from 'src/app/interfaces/interface';
import { ChartData, ChartOptions, registerables, Chart, ChartType } from 'chart.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-vizualizar-parametro',
  templateUrl: './vizualizar-parametro.component.html',
  styleUrls: ['./vizualizar-parametro.component.scss'],
})
export class VizualizarParametroComponent implements OnInit {
  parametro: any;
  paciente: any;
  fechaIni: string = '';
  fechaFin: string = '';
  datos: DatoBiome[] = [];

  mostrarSelectorInicio: boolean = false;
  mostrarSelectorFin: boolean = false;

  public chartData: any[] = [];
  public chartLabels: string[] = [];
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartType: ChartType = 'line'; 
  tipoGrafico: string = 'linea';
  //selectedChartType: string = 'line';


  constructor(
    private injector: Injector,
    private router: Router,
    private parametrosService: ParametrosService
  ) {}

  ngOnInit() {
    this.parametro = this.injector.get('parametro');
    this.paciente = this.injector.get('paciente');
    //console.log('Parametro recibido:', this.parametro);
    //console.log('Paciente recibido:', this.paciente);
    this.obtenerDatos();
  }

  obtenerDatos() {
    if (this.parametro && this.paciente) {
      this.obtenerDatosDelServicio();
    } else {
      console.error('No se recibieron datos del parámetro o paciente');
    }
  }
  actualizarGrafico() {
    // Aquí puedes agregar lógica para actualizar los gráficos si es necesario
   // console.log(`Tipo de gráfico seleccionado: ${this.tipoGrafico}`);
  }

  obtenerDatosDelServicio() {
    if (this.fechaIni && this.fechaFin) {
      const requestData = {
        id_usuario: this.paciente.id_usuario,
        id_parametro: this.parametro.id_parametro,
        fecha_ini: this.formatDate(this.fechaIni),
        fecha_fin: this.formatDate(this.fechaFin),
      };
  
      this.parametrosService.obtenerdatosbiome(requestData).subscribe(
        (response: any) => {
         // console.log('Respuesta completa:', response);
          this.datos = response;
          this.calcularEstadisticas();
          // Agrupar datos por hora
          const groupedData: { [key: string]: number[] } = {};
          this.datos.forEach(dato => {
            // Obtener la fecha y hora (sin minutos y segundos)
            const date = new Date(dato.fecha);
            const hourKey = `${date.toISOString().split('T')[0]} ${date.getHours()}`; // Formato: YYYY-MM-DD HH
  
            // Agrupar los valores por hora
            if (!groupedData[hourKey]) {
              groupedData[hourKey] = [];
            }
            groupedData[hourKey].push(parseFloat(dato.valor));
          });
  
          // Calcular el promedio por hora
          this.chartLabels = Object.keys(groupedData);
          this.chartData = [{
            data: this.chartLabels.map(label => {
              const values = groupedData[label];
              const average = values.reduce((sum, value) => sum + value, 0) / values.length; // Calcular promedio
              return average || 0; // Devolver 0 si el promedio es NaN
            }),
            label: 'Promedio por hora', // Cambia esto según el parámetro
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true,
          }];
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }
  

  
  
  // Método para formatear la fecha
  private formatDate(fecha: string): string {
    return fecha ? fecha.split('T')[0] : ''; // Devuelve solo la parte de fecha
  }
  

  toggleDateSelectors() {
    this.mostrarSelectorInicio = !this.mostrarSelectorInicio;
    this.mostrarSelectorFin = !this.mostrarSelectorFin;
  }
  cerrarSelector(tipo: string) {
    if (tipo === 'inicio') {
      this.mostrarSelectorInicio = false; // Oculta el selector de inicio
    } else if (tipo === 'fin') {
      this.mostrarSelectorFin = false; // Oculta el selector de fin
    }
  }
  onChartTypeChange() {
    this.chartOptions.scales = {}; 
    //console.log('Tipo de gráfico cambiado a:', this.chartType);
    this.obtenerDatosDelServicio(); // Reobtenemos los datos para actualizar el gráfico
  }
  calcularEstadisticas() {
    if (this.datos.length === 0) return;
  
    // Obtener valores numéricos
    const valores = this.datos.map(dato => parseFloat(dato.valor));
  
    // Calcular media
    const suma = valores.reduce((sum, valor) => sum + valor, 0);
    const media = suma / valores.length;
  
    // Calcular mediana
    valores.sort((a, b) => a - b);
    const mitad = Math.floor(valores.length / 2);
    const mediana = valores.length % 2 !== 0 ? valores[mitad] : (valores[mitad - 1] + valores[mitad]) / 2;
  
    // Calcular moda
    const frecuencia: { [key: number]: number } = {};
    valores.forEach(val => frecuencia[val] = (frecuencia[val] || 0) + 1);
    const maxFrecuencia = Math.max(...Object.values(frecuencia));
    const moda = Object.keys(frecuencia).filter(val => frecuencia[parseFloat(val)] === maxFrecuencia).map(Number);
  
    // Calcular días con valores más altos y bajos
    const valorMax = Math.max(...valores);
    const valorMin = Math.min(...valores);
    const diasMaximos = this.datos.filter(dato => parseFloat(dato.valor) === valorMax).map(dato => dato.fecha);
    const diasMinimos = this.datos.filter(dato => parseFloat(dato.valor) === valorMin).map(dato => dato.fecha);
  
    // Asignar resultados para mostrar
    this.resultadosEstadisticos = {
      media,
      mediana,
      moda,
      diasMaximos,
      diasMinimos,
      valorMax,
      valorMin
    };
  }
  
  // Declarar variable para los resultados
  public resultadosEstadisticos: any = {};
  





// Generar PDF con solo los gráficos como imagen
generarPDF() {
  const charts = document.querySelectorAll('.chart-container'); // Asegúrate de que los gráficos tengan una clase 'chart-container'
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yOffset = 10; // Posición inicial en el eje Y para los gráficos

  // Título del reporte
  pdf.setFontSize(16);
  pdf.text('Reporte de Datos', 10, yOffset);
  yOffset += 10;

  // Información sobre el parámetro
  pdf.setFontSize(12);
  pdf.text(`Parámetro: ${this.parametro.nombre}`, 10, yOffset);
  yOffset += 10;

  // Información sobre el paciente
  pdf.text(`Paciente: ${this.paciente.cedula  }${this.paciente.apellido}`, 10, yOffset);
  yOffset += 10;


  charts.forEach((chart, index) => {
    // Convertir el gráfico en una imagen
    html2canvas(chart as HTMLElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ancho A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la relación de aspecto

      // Agregar la imagen del gráfico al PDF
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 10; // Desplazar la posición Y para el siguiente gráfico

      // Si es el último gráfico, guardar el PDF
      if (index === charts.length - 1) {
        pdf.save('reporte.pdf');
      }
    });
  });

   // Agregar la lista de datos obtenidos del servicio
pdf.setFontSize(12);
pdf.text('Datos obtenidos:', 10, yOffset);
yOffset += 10;

// Establecer el ancho de las columnas
const columnWidth = 90;
let xOffset1 = 10;  // Posición inicial para la primera columna
let xOffset2 = 110; // Posición inicial para la segunda columna

// Crear tabla de datos
this.datos.forEach((dato, index) => {
  const fecha = dato.fecha ? dato.fecha : 'No disponible';
  const valor = dato.valor ? dato.valor : 'No disponible';
  const unidad_medida = dato.unidad_medida ? dato.unidad_medida : 'No disponible';
  
  // Colocar los datos en las dos columnas
  pdf.text(`Fecha: ${fecha}`, xOffset1, yOffset);
  pdf.text(`Valor: ${valor}${unidad_medida}`, xOffset2, yOffset);
  
  
  // Ajustar la posición vertical para el siguiente dato
  yOffset += 10;


    // Asegurarse de no sobrepasar los márgenes de la página
    if (yOffset > 270) {
      pdf.addPage();
      yOffset = 10; // Reiniciar la posición Y cuando se crea una nueva página
    }
  });
}

// Ejemplo para llamar a la función cuando se haga clic en un botón
descargarPDF() {
  this.generarPDF();
}

}
  

