import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { WebSocketService } from 'src/app/servicios/web-socket.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions, registerables, Chart, ChartType } from 'chart.js';
import 'chartjs-adapter-date-fns';  // Importar el adaptador de fechas

Chart.register(...registerables);

@Component({
  selector: 'app-datostiemporeal',
  templateUrl: './datostiemporeal.page.html',
  styleUrls: ['./datostiemporeal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BaseChartDirective]
})
export class DatostiemporealPage implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  usuarioActual: any | null = null;
  mensajeError: string = '';
  datos: any = {};
  idUsuario: string | null = null;

  chartType: ChartType = 'line';  // Asegúrate de definir el tipo de gráfico

  chartData: ChartData<'line'> = {
    labels: [], // Aquí se guardan las fechas
    datasets: [
      {
        data: [], // Aquí se guardan los valores
        label: 'Temperatura',
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        spanGaps: false // No unir los puntos
      }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'  // Mostrar solo la hora y minutos
          }
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  chartLegend = true;
  chartPlugins = [];

  private webSocketSubscription?: any;
  private periodicSubscription?: any;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private messageService: GeneralService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  ngOnDestroy() {
    this.desconectarWebSocket();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual) {
      this.idUsuario = this.usuarioActual.id_usuario;
      this.iniciarConexionWebSocket();
    } else {
      this.mensajeError = 'No se pudo obtener el usuario actual.';
    }
  }

  iniciarConexionWebSocket() {
    if (this.idUsuario) {
      this.webSocketService.sendMessage({ id_usuario: this.idUsuario });
      this.periodicSubscription = this.webSocketService.sendMessagePeriodically({ id_usuario: this.idUsuario }, 5000);

      this.webSocketSubscription = this.webSocketService.getMessages().subscribe(
        (messages: any[]) => {
          console.log('Datos recibidos:', messages);
          messages.forEach(message => this.actualizarGrafico(message));
        },
        (error) => {
          console.error('Error en el WebSocket', error);
          this.mensajeError = 'Error en la conexión WebSocket.';
        }
      );
    } else {
      this.mensajeError = 'ID de usuario no disponible.';
    }
  }

  desconectarWebSocket() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe(); // Cancelar la suscripción
    }
    if (this.periodicSubscription) {
      this.periodicSubscription.unsubscribe(); // Cancelar el envío periódico
    }
    this.webSocketService.disconnect(); // Cerrar la conexión WebSocket
  }

  actualizarGrafico(datos: any) {
    if (datos && datos.nombre === 'Temperatura') {
      // Convertir la fecha del formato 'YYYY-MM-DD HH:mm:ss' a 'Date'
      const currentTime = new Date(datos.fecha.replace(' ', 'T') + 'Z'); // Añadir 'Z' para UTC

      // Añadir los datos al gráfico
      if (this.chartData.labels) {
        this.chartData.labels.push(currentTime);
        this.chartData.datasets[0].data.push(parseFloat(datos.valor));

        // Limitar la cantidad de puntos en el gráfico si es necesario
        if (this.chartData.labels.length > 20) {
          this.chartData.labels.shift();
          this.chartData.datasets[0].data.shift();
        }

        this.chart?.update();
      }
    }
  }
}








/* // datostiemporeal.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { WebSocketService } from 'src/app/servicios/web-socket.service';


@Component({
  selector: 'app-datostiemporeal',
  templateUrl: './datostiemporeal.page.html',
  styleUrls: ['./datostiemporeal.page.scss'],
})
export class DatostiemporealPage implements OnInit {
  usuarioActual: any | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';
  datos: any[] = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private messageService: GeneralService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual) {
      this.iniciarConexionWebSocket();
    } else {
      this.mensajeError = 'No se pudo obtener el usuario actual.';
    }
  }

  iniciarConexionWebSocket() {
    // Enviar el ID del usuario al servidor WebSocket
    this.webSocketService.sendMessage({ id_usuario: this.usuarioActual.id_usuario });

    // Suscribirse a los mensajes del WebSocket
    this.webSocketService.getMessages().subscribe(
      (message) => {
        this.datos.push(message);
      },
      (error) => {
        console.error('Error en el WebSocket', error);
        this.mensajeError = 'Error en la conexión WebSocket.';
      }
    );
  }
}
 */