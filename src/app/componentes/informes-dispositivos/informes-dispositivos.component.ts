import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AdministradorService } from 'src/app/servicios/administrador.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-informes-dispositivos',
  templateUrl: './informes-dispositivos.component.html',
  styleUrls: ['./informes-dispositivos.component.scss'],
})
export class InformesDispositivosComponent implements OnInit {
  listadispositivos: any[] = [];
  dispositivosPorMes: { [key: string]: number } = {};
  meses: string[] = [];
  conteoDispositivosPorMes: number[] = [];
  estadisticasPorMes: any[] = [];
  estadisticasPorAnio: any[] = [];
  totalDispositivos: number = 0;
  anios: number[] = [];
  totalDispositivosPorAnio: number[] = [];
  @ViewChild('grafico', { static: false }) grafico!: ElementRef;
  @ViewChild('grafico1', { static: false }) grafico1!: ElementRef;
  constructor(
    private router: Router,
    private administradorservice: AdministradorService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.obtenerDispositivos();
  }

  obtenerDispositivos() {
    this.administradorservice.lista_dispositivos().subscribe(
      (response) => {
        this.listadispositivos = response.dispositivos;
        this.generarEstadisticas();
      },
      (error) => {
        //console.error('Error al obtener la lista de dispositivos', error);
      }
    );
  }

  generarEstadisticas() {
    this.dispositivosPorMes = {};
    this.totalDispositivos = 0;
  
    const anioActual = moment().year();
    const mesActual = moment().month(); // Obtiene el índice del mes actual (0 = enero, 1 = febrero, ...)
  
    // Inicializar todos los meses del año actual en `0`
    const mesesOrdenados = moment.months(); // Meses en orden, de enero a diciembre
    mesesOrdenados.forEach((mes, index) => {
      if (index <= mesActual) { // Solo se incluyen meses hasta el mes actual
        const mesAnio = `${mes} ${anioActual}`;
        this.dispositivosPorMes[mesAnio] = 0;
      }
    });
  
    // Llenar los datos de dispositivos solo para los meses con registros
    this.listadispositivos.forEach((dispositivo) => {
      const fechaRegistro = moment(dispositivo.fecha_registro);
  
      if (fechaRegistro.year() === anioActual && fechaRegistro.month() <= mesActual) {
        const mes = fechaRegistro.format('MMMM YYYY');
        this.dispositivosPorMes[mes]++;
        this.totalDispositivos++;
      }
    });
  
    // Filtrar los meses hasta el mes actual y obtener el conteo de dispositivos por mes
    this.meses = mesesOrdenados
      .slice(0, mesActual + 1) // Obtiene solo los meses hasta el mes actual
      .map((mes) => `${mes} ${anioActual}`);
  
    this.conteoDispositivosPorMes = this.meses.map(
      (mes) => this.dispositivosPorMes[mes]
    );
  
    this.calcularEstadisticasDetalladas();
    this.calcularEstadisticasPorAnio();
  }
  
  
  calcularEstadisticasDetalladas() {
    let dispositivosAcumulados = 0;
    let dispositivosNuevosPrevioMes: number | null = null;
    let acumuladoPrevioMes: number | null = null;
  
    this.estadisticasPorMes = this.meses.map((mes) => {
      const dispositivosNuevos = this.dispositivosPorMes[mes];
      dispositivosAcumulados += dispositivosNuevos;
  
      let cambioMensual = '-';
      let tasaCrecimiento = '-';
  
      if (dispositivosNuevosPrevioMes !== null) {
        // Si el mes anterior tiene 0 dispositivos nuevos, calcular como un aumento del 100% si hay nuevos dispositivos
        if (dispositivosNuevosPrevioMes === 0) {
          cambioMensual = dispositivosNuevos > 0 ? '100%' : '0%';
        } else {
          // Calcula el cambio mensual normal si el valor previo no es 0
          cambioMensual = (
            ((dispositivosNuevos - dispositivosNuevosPrevioMes) / dispositivosNuevosPrevioMes) *
            100
          ).toFixed(2) + '%';
        }
      }
  
      if (acumuladoPrevioMes !== null) {
        // Si el acumulado del mes anterior es 0, considera un 100% si el acumulado actual es mayor a 0
        if (acumuladoPrevioMes === 0) {
          tasaCrecimiento = dispositivosAcumulados > 0 ? '100%' : '0%';
        } else {
          // Calcula la tasa de crecimiento usando el acumulado normal
          tasaCrecimiento = (
            ((dispositivosAcumulados - acumuladoPrevioMes) / acumuladoPrevioMes) *
            100
          ).toFixed(2) + '%';
        }
      }
  
      // Actualiza los valores para el próximo mes
      dispositivosNuevosPrevioMes = dispositivosNuevos;
      acumuladoPrevioMes = dispositivosAcumulados;
  
      return {
        mes,
        dispositivosNuevos,
        totalDispositivos: dispositivosAcumulados,
        cambioMensual,
        tasaCrecimiento
      };
    });
  }
  
  
  
  
  calcularEstadisticasPorAnio() {
    const dispositivosPorAnio: { [key: number]: { activos: number; inactivos: number } } = {};
    let dispositivosAcumulados = 0;
    let dispositivosPrevioAnio: number | null = null;

    // Inicializa el objeto para contar dispositivos activos e inactivos
    this.listadispositivos.forEach((dispositivo) => {
        const fechaRegistro = moment(dispositivo.fecha_registro);
        const anio = fechaRegistro.year();

        if (!dispositivosPorAnio[anio]) {
            dispositivosPorAnio[anio] = { activos: 0, inactivos: 0 };
        }

        // Incrementa el contador según el estado del dispositivo
        if (dispositivo.estado === 'A') {
            dispositivosPorAnio[anio].activos++;
        } else if (dispositivo.estado === 'I') {
            dispositivosPorAnio[anio].inactivos++;
        }
    });

    // Asigna los valores a las propiedades `anios` y `totalDispositivosPorAnio`
    this.anios = Object.keys(dispositivosPorAnio).map(anio => parseInt(anio));
    this.totalDispositivosPorAnio = this.anios.map(anio => dispositivosPorAnio[anio].activos + dispositivosPorAnio[anio].inactivos);

    // Genera estadísticas anuales detalladas
    this.estadisticasPorAnio = this.anios.map((anio) => {
        const dispositivosNuevos = dispositivosPorAnio[anio].activos + dispositivosPorAnio[anio].inactivos;
        dispositivosAcumulados += dispositivosNuevos;

        let cambioAnual = '-';
        let tasaCrecimiento = '-'; // Nueva variable para la tasa de crecimiento

        if (dispositivosPrevioAnio !== null && dispositivosPrevioAnio > 0) {
            // Calcular el cambio porcentual respecto al año anterior
            cambioAnual = (
                ((dispositivosNuevos - dispositivosPrevioAnio) / dispositivosPrevioAnio) *
                100
            ).toFixed(2) + '%';

            // Cálculo correcto de la tasa de crecimiento
            tasaCrecimiento = (
                ((dispositivosAcumulados - dispositivosPrevioAnio) / dispositivosPrevioAnio) *
                100
            ).toFixed(2) + '%';
        }

        dispositivosPrevioAnio = dispositivosAcumulados; // Actualiza para el próximo año

        return {
            anio,
            dispositivosNuevos,
            totalDispositivos: dispositivosAcumulados,
            cambioAnual,
            tasaCrecimiento,
            dispositivosActivos: dispositivosPorAnio[anio].activos,
            dispositivosInactivos: dispositivosPorAnio[anio].inactivos // Agrega el conteo de dispositivos inactivos
        };
    });
}


  
  // Método para generar el PDF
generarPDF() {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(16);
  doc.text('Reporte Estadístico de Dispositivos', 20, 20);

  // Reporte de dispositivos por mes
  doc.setFontSize(12);
  doc.text('Dispositivos Nuevos por Mes', 20, 30);

  // Dibuja los datos de los dispositivos por mes
  const startY = 40;
  this.estadisticasPorMes.forEach((estadistica, index) => {
    const y = startY + (index * 10);
    doc.text(`${estadistica.mes}: ${estadistica.dispositivosNuevos} nuevos dispositivos`, 20, y);
  });

  // Captura del gráfico de barras
  html2canvas(this.grafico.nativeElement).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    doc.addPage();
    doc.text('Gráfico de Dispositivos Nuevos por Mes', 20, 20);
    doc.addImage(imgData, 'PNG', 20, 30, 180, 100); // Ajusta el tamaño de la imagen según sea necesario

    // Captura del segundo gráfico (Gráfico adicional)
    html2canvas(this.grafico1.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addPage();
      doc.text('Gráfico cantidad de dispositivos por año', 20, 20);
      doc.addImage(imgData, 'PNG', 20, 30, 180, 100); // Ajusta el tamaño de la imagen según sea necesario

      // Agrega el reporte de dispositivos por año
      doc.addPage();
      doc.text('Dispositivos Nuevos por Año', 20, 20);
      this.estadisticasPorAnio.forEach((estadistica, index) => {
        const y = 30 + (index * 10);
        doc.text(`${estadistica.anio}: ${estadistica.dispositivosNuevos} nuevos dispositivos`, 20, y);
      });

      // Guarda el archivo PDF
      doc.save('reporte_dispositivos.pdf');
    }).catch(error => {
      console.error('Error al capturar el segundo gráfico:', error);
    });
  }).catch(error => {
    console.error('Error al capturar el primer gráfico:', error);
  });
}

  

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}