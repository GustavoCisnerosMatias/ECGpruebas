import { Component, OnInit, Injector, Injector as AngularInjector } from '@angular/core';
import { Router } from '@angular/router';
import { ParametrosService } from 'src/app/servicios/parametros.service';
import { Parametro, RespuestaParametros } from 'src/app/interfaces/interface';
import { VizualizarParametroComponent } from 'src/app/componentes/vizualizar-parametro/vizualizar-parametro.component';

@Component({
  selector: 'app-vizualizar-parametros',
  templateUrl: './vizualizar-parametros.page.html',
  styleUrls: ['./vizualizar-parametros.page.scss'],
})
export class VizualizarParametrosPage implements OnInit {
  paciente: any;
  parametros: any[] = [];
  otrosParametros: any[] = [];
  componenteADisplay: any;
  dynamicComponentInjector: AngularInjector = this.injector;  // Initializing with default injector

  constructor(
    private router: Router,
    private parametrosService: ParametrosService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.obtenerPaciente();
    this.cargarParametros();
  }

  cargarParametros() {
    this.parametrosService.obtenerParametros().subscribe((data: RespuestaParametros) => {
      //console.log('Datos recibidos:', data);
      this.parametros = data.datos;
      const nombres = this.parametros.map(p => p.nombre);

    // Filtra los parámetros para mostrar solo los no relacionados con la presión arterial
    this.otrosParametros = this.parametros.filter(p => p.nombre !== 'presión_Sistolica' && p.nombre !== 'presión_Diastolica');
    });
  }

  obtenerPaciente() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { paciente: any };
      if (state && state.paciente) {
        this.paciente = state.paciente;
       // console.log('Datos del paciente:', this.paciente);
      } else {
       // console.error('No se recibieron datos del paciente');
      }
    }
  }

  

  onParametroClick(parametro: any) {
    this.componenteADisplay = VizualizarParametroComponent;

    // Create an injector with the current parameters
    this.dynamicComponentInjector = Injector.create({
      providers: [
        { provide: 'parametro', useValue: parametro },
        { provide: 'paciente', useValue: this.paciente }
      ],
      parent: this.injector
    });
  }
}