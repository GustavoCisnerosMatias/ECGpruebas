import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Chart, DoughnutController, Tooltip, Legend } from 'chart.js';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TagoService } from 'src/app/servicios/tago.service';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';

interface Dato {
  variable: string;
  value: number;
  unit: string;
  time: string;
}

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit, OnDestroy {
  usuarioActual: any | null = null;
  datosFisicos: any = {}; // Almacena peso y estatura
  idUsuario: string | null = null;
  subscription: Subscription | null = null; // Para controlar el intervalo
  datos: Dato[] = []; // Datos para el gráfico
  charts: Chart<'doughnut'>[] = []; // Array para instancias de gráficos
  mensajeError: string | null = null; // Mensaje de error
  imc: number | null = null; // Almacena el valor del IMC
  descripcionIMC: string = ''; // Descripción del IMC
  pesoIdealMin: number | null = null; // Peso ideal mínimo
  pesoIdealMax: number | null = null; // Peso ideal máximo

  @ViewChildren('doughnutCanvas') canvasElements!: QueryList<ElementRef>; // Referencias a los canvas

  // Colores únicos para los gráficos
  colores: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  constructor(
    private togService: TagoService,
    private authService: SerAutentificacionService
  ) {
    // Register the required controllers and elements for Chart.js
    Chart.register(DoughnutController, Tooltip, Legend);
  }

  ngOnInit() {
    this.cargarDatosFisicos();
    this.simularTiempoReal(); // Inicia el envío de solicitudes cada segundo
  }

  ngOnDestroy() {
    // Detener el intervalo cuando se destruye el componente
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Destruir los gráficos si existen
    this.charts.forEach(chart => chart.destroy());
  }

  cargarDatosFisicos() {
    this.datosFisicos = this.authService.datosfisicos[0] || {}; // Asigna el primer dato de datosfisicos
    if (this.datosFisicos.peso && this.datosFisicos.estatura) {
      this.calcularIMC(this.datosFisicos.peso, this.datosFisicos.estatura);
    } else {
      //console.error('Datos de peso o estatura no encontrados');
      this.mensajeError = 'Datos de peso o estatura no encontrados';
    }
  }

  obtenerDatos(token: string) {
    // Establecer un intervalo de 1 segundo (1000 milisegundos)
    this.subscription = interval(3000)
      .pipe(
        switchMap(() => this.togService.getData(token)) // Llamar al servicio cada segundo
      )
      .subscribe(
        (response) => {
          this.actualizarDatos(response.result); // Actualizar datos sin repetición
        },
        (error) => {
          //console.error('Error al obtener los datos de Tago.io', error);
          this.mensajeError = 'Error al obtener los datos de Tago.io';
        }
      );
  }
  

  actualizarDatos(nuevosDatos: Dato[]) {
    // Asegurarse de que cada variable sea única
    const uniqueVariables = new Set();
    this.datos = nuevosDatos.filter(dato => {
      if (!uniqueVariables.has(dato.variable)) {
        uniqueVariables.add(dato.variable);
        return true;
      }
      return false;
    });

    // Después de actualizar los datos, espera un poco para que los canvas estén disponibles
    setTimeout(() => this.actualizarGraficos(), 0);
  }

  actualizarGraficos() {
    // Destruir los gráficos existentes
    this.charts.forEach(chart => chart.destroy());
    this.charts = []; // Vaciar el array de gráficos

    // Crear un nuevo gráfico para cada dato
    this.canvasElements.forEach((canvasEl, index) => {
      if (this.datos[index]) {
        const dato = this.datos[index];
        const chart = new Chart(canvasEl.nativeElement, {
          type: 'doughnut',
          data: {
            labels: [dato.variable],
            datasets: [{
              data: [dato.value, 100 - dato.value], // El valor y el resto del gráfico (vacío)
              backgroundColor: [this.colores[index % this.colores.length], '#e0e0e0'], // Color para el valor y el fondo
              borderColor: '#fff',
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  color: '#000', // Color de la leyenda
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number; // Forzar tipo a number
                    const unit = dato.unit || '';
                    return `${dato.variable}: ${value.toFixed(2)} ${unit}`; // Muestra el valor y la unidad
                  }
                }
              }
            }
          }
        });
        this.charts.push(chart);
      }
    });
  }

  simularTiempoReal() {
    this.subscription = interval(20000)
      .pipe(
        switchMap(() => this.togService.getData(this.datosFisicos.codigo || '')) // Llama al servicio cada segundo
      )
      .subscribe(
        (response) => {
          this.actualizarDatos(response.result); // Actualizar los datos con la nueva respuesta
        },
        (error) => {
          //console.error('Error en la simulación de tiempo real', error);
          this.mensajeError = 'Error en la obtención de los datos en tiempo real';
        }
      );
  }

  getCardClass(variable: string): string {
    switch (variable) {
      case 'temperatura':
        return 'card-temperatura';
      case 'frecuencia':
        return 'card-frecuencia';
      case 'saturacion':
        return 'card-saturacion';
      default:
        return 'card-default';
    }
  }
//calculo peso
  calcularIMC(peso: number, estatura: number) {
    // Convertir estatura a metros si está en centímetros
    
    this.imc = peso / (estatura * estatura);
  
    // Calcular el peso ideal basado en un rango de IMC de 18.5 a 24.9
    this.pesoIdealMin = 18.5 * (estatura * estatura);
    this.pesoIdealMax = 24.9 * (estatura * estatura);
  
    // Determinar la descripción del IMC
    if (this.imc < 18.5) {
      this.descripcionIMC = 'Peso bajo';
    } else if (this.imc >= 18.5 && this.imc < 25) {
      this.descripcionIMC = 'Peso normal';
    } else if (this.imc >= 25 && this.imc < 30) {
      this.descripcionIMC = 'Sobrepeso';
    } else if (this.imc >= 30 && this.imc < 40) {
      this.descripcionIMC = 'Obesidad';
    } else {
      this.descripcionIMC = 'Obesidad mórbida';
    }
  }
  
  
}

