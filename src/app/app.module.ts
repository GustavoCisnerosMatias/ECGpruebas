import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables  } from 'ng2-charts';
import { bootstrapApplication } from '@angular/platform-browser';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';

/* const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: true,
  hostname: '192.168.100.4', // Dirección IP de tu broker
  port: 1883, // Puerto (puede ser 1883 o 8883 para SSL)
  username: 'brokeriot', // Tu usuario
  password: '1234Proyecto', // Tu contraseña
  path: '/mqtt' // o 'mqtts' para SSL
}; */
/* const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '192.168.100.4',
  port: 9001,
  username: 'brokeriot',
  password: '1234Proyecto',
 }; */
// Opciones para el broker remoto (broker público como test.mosquitto.org)
/* const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'test.mosquitto.org',
  port: 8081, // El puerto por defecto para websockets en brokers públicos
  path: '/mqtt',
}; */

/* const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'test.mosquitto.org',
  port: 8081, // Puerto para MQTT con cifrado
  // path: '/mqtt', // No es necesario especificar el path aquí
  protocol: 'wss', // Usar WebSockets seguros
  // username y password pueden omitirse si no son necesarios
  // username: 'tu_usuario',
  // password: 'tu_contraseña',
};  */


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'broker.emqx.io',
  port: 8084, // Cambia a 8084 para WebSocket seguro
  protocol: 'wss',
  path: '/mqtt', // Si tu broker requiere un path, agréguelo aquí
};



@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),


  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideCharts(withDefaultRegisterables()) // Configuración global
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
