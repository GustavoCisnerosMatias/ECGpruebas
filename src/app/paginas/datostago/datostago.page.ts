import { Component, OnInit } from '@angular/core';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { TagoService } from 'src/app/servicios/tago.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-datostago',
  templateUrl: './datostago.page.html',
  styleUrls: ['./datostago.page.scss'],
})
export class DatostagoPage implements OnInit {
  datos: any[] = []; // Arreglo para almacenar los datos
  datotoken: any = {}; // token

  constructor(
    private authService: SerAutentificacionService,
    private togService: TagoService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.cargartoken();
  }

  cargartoken() {
    this.datotoken = this.authService.datosfisicos[0] || {}; 
    if (this.datotoken.codigo) {
      // Una vez que tienes el token, obtén los datos
      this.obtenerDatos(this.datotoken.codigo);
    } else {
      //console.error('Token no encontrado');
    }
  }

  obtenerDatos(token: string) {
    this.togService.getData(token).subscribe(
      (response) => {
        this.datos = response.result; // Adaptar según la estructura de los datos de Tago.io
        //console.log(this.datos); // Verificar los datos en la consola
      },
      (error) => {
        //console.error('Error al obtener los datos de Tago.io', error);
      }
    );
  }
}














/* import { Component, OnInit } from '@angular/core';
import { TagoService } from 'src/app/servicios/tago.service';

@Component({
  selector: 'app-datostago',
  templateUrl: './datostago.page.html',
  styleUrls: ['./datostago.page.scss'],
})
export class DatostagoPage implements OnInit {

  public realTimeData: any;

  constructor(private tagoService: TagoService) {}

  ngOnInit() {
    this.getRealTimeData();
  }

  getRealTimeData() {
    const deviceId = '663e4e0be4b9b4000801e37b';  // Reemplaza con tu device ID de Tago.io
    this.tagoService.getData(deviceId).subscribe(data => {
      this.realTimeData = data;
      console.log(this.realTimeData);
    }, error => {
      console.error('Error al obtener datos de Tago.io', error);
    });
  }
} */