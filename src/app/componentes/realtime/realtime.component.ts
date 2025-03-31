

import { Component, OnDestroy } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Dato, DatoBiome, ITopic } from 'src/app/interfaces/interface';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { Subscription } from 'rxjs';
import { ParametrosService } from 'src/app/servicios/parametros.service';
import { Parametro, RespuestaParametros } from 'src/app/interfaces/interface';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { PacienteService } from 'src/app/servicios/paciente.service';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent implements OnDestroy {
  latestData: any = null;
  isLoading: boolean = true;
  dataHistory: any[] = [];
  Topic: ITopic[] = [];
  datos: Dato [] = [];
  otrosParametros: any[] = [];
  parametros: any[] = [];
  mensajeError: string | null = null; // Mensaje de error


  showTooltip: boolean = false;


  usuarioActual: any | null = null;
  datosFisicos: any = {}; // Almacena peso y estatura
  idUsuario: number | null = null;
  private subscriptions: Subscription[] = []; // Lista para almacenar las suscripciones

  constructor(private serP: PacienteService,private usuariosService: UsuariosService,public router: Router,private mqttService: MqttService, private serM: SerAutentificacionService,private parametrosService: ParametrosService) {}

  ngOnInit() {
    this.isLoading = true;
    this.Topic = this.serM.getTopics(); // Obtener los tópicos del servicio
    //console.log(this.Topic);
    this.Topic.forEach(topic => {
      if (topic && topic.nombre) { // Asegúrate de que el nombre del tópico esté definido
        this.subscribeToTopic(topic.nombre); // Suscribirse a cada tópico
      } else {
        //console.error('Nombre del tópico no definido:', topic);
      }
    });
   
    this.cargarParametros();
    this.cargarUsuarioActual();
  }
  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.idUsuario = this.usuarioActual.id_usuario;    }
  }


  
  

  obtenerNombreParametro(id: number): string {
    const parametro = this.parametros.find(p => p.id_parametro === id);
    return parametro ? parametro.nombre : 'Desconocido'; // Devuelve un nombre por defecto si no se encuentra
  }
  
  /* subscribeToTopic(topic: string) {
    const subscription = this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
      const data = JSON.parse(message.payload.toString());
      this.latestData = data;
      this.dataHistory.push(data);
      console.log(data); // Para verificar los datos recibidos
    });

    this.subscriptions.push(subscription); // Almacenar la suscripción en la lista
  } */
    // Método para limpiar y validar los datos que llegan desde MQTT
limpiarYValidarDatos(data: Dato[]): Dato[] {
  return data.filter(dato => {
    // Validar si el valor es un número
    if (isNaN(dato.valor)) {
     // console.warn(`Valor no numérico encontrado en el parámetro ${dato.id_parametro}: ${dato.valor}`);
      return false; // Ignorar si no es un número
    }

    // Validar según el id_parametro
    switch (dato.id_parametro) {
      case 1: // Temperatura
        if (dato.valor < 17.0 || dato.valor > 50) {
          //console.warn(`Valor fuera del rango permitido para id_parametro = 1: ${dato.valor}`);
          return false; // Ignorar si está fuera del rango permitido
        }
        break;
      case 2: // Frecuencia cardíaca
        if (dato.valor < 50 || dato.valor > 180) {
         // console.warn(`Valor fuera del rango permitido para id_parametro = 2: ${dato.valor}`);
          return false; // Ignorar si está fuera del rango permitido
        }
        break;
      case 5: // Saturación
        if (dato.valor < 50 || dato.valor > 120) {
          //console.warn(`Valor fuera del rango permitido para id_parametro = 5: ${dato.valor}`);
          return false; // Ignorar si está fuera del rango permitido
        }
        break;
      default:
        // Puedes agregar más validaciones para otros parámetros si es necesario
        break;
    }

    // Si pasa todas las validaciones, el dato es válido
    return true;
  });
}

subscribeToTopic(topic: string) {
  const subscription = this.mqttService.observe(topic, { qos: 2 }).subscribe(
    (message: IMqttMessage) => {
      try {
        const data = JSON.parse(message.payload.toString());
        //console.log('Datos recibidos:', data);

        // Asegúrate de que los datos sean un array
        if (Array.isArray(data)) {
          // Limpiar y validar los datos
          const datosLimpios = this.limpiarYValidarDatos(data);
          
          // Actualizar los datos solo con los datos válidos
          this.latestData = datosLimpios;
          this.dataHistory.push(...datosLimpios);

          // Usar un Map para actualizar de forma eficiente
          const datosMap = new Map(this.datos.map(d => [d.id_parametro, d]));

          datosLimpios.forEach((dato: Dato) => {
            if (dato.id_parametro) {
              datosMap.set(dato.id_parametro, dato); // Actualiza el valor
              this.isLoading = false;
            }
          });

          this.datos = Array.from(datosMap.values()); // Actualiza `this.datos`
        } else {
          //console.warn('Los datos recibidos no son un array:', data);
        }
      } catch (error) {
        //console.error('Error al procesar el mensaje:', error);
      }
    },
    (error) => {
      //console.error('Error en la suscripción:', error);
    }
  );

  this.subscriptions.push(subscription); // Almacenar la suscripción en la lista
}

    
    
    cargarParametros() {
      this.parametrosService.obtenerParametros().subscribe((data: RespuestaParametros) => {
        //console.log('Datos recibidos:', data);
        this.parametros = data.datos;
        const nombres = this.parametros.map(p => p.nombre);
        //this.isLoading = false; 
      // Filtra los parámetros para mostrar solo los no relacionados con la presión arterial
      this.otrosParametros = this.parametros.filter(p => p.nombre !== 'presión_Sistolica' && p.nombre !== 'presión_Diastolica');
      });
    }
    

  ngOnDestroy() {
    // Cancelar todas las suscripciones cuando el componente se destruya
    this.subscriptions.forEach(sub => sub.unsubscribe());
   // console.log('Todas las suscripciones a MQTT se han cancelado');
  }


  

 
  getCardClass(variable: number): string {
    switch (variable) {
      case 1:
        return 'card-temperatura';
      case 2:
        return 'card-frecuencia';
      case 5:
        return 'card-saturacion';
      default:
        return 'card-default';
    }
  }

  determinarClase(valor: number): string {
    if (valor > 38.1) {
      return 'icono-rojo';
    } else if (valor < 36.5) {
      return 'icono-azul';
    }
    return 'icono-verde';
  }
  obtenerColorFrecuencia(valor: number): string {
    if (valor < 60) {
      return 'red'; // Azul para bradicardia
    } else if (valor > 100) {
      return 'blue'; // Rojo para taquicardia
    }
    return 'green'; // Verde para frecuencia normal
  }
  
  

}
