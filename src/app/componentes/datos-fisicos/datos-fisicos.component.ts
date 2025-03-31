import { Component, Input } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-fisicos',
  templateUrl: './datos-fisicos.component.html',
  styleUrls: ['./datos-fisicos.component.scss'],
})
export class DatosFisicosComponent {
  @Input() datos: any;
  usuarioActual: any | null = null;
  datosFisicos: any = {
    peso: '',
    estatura: ''
  };
  estaturas: number[] = [];
  pesos: number[] = [];
  errorMensaje: string = '';

  constructor(
    public router: Router,private usuariosService: UsuariosService,
    private alertController: AlertController // Inyecta AlertController
  ) {}

  ngOnInit() {
    this.cargarEstaturas();
    this.cargarPesos();
    this.cargarUsuarioActual();
  }

  mostrarModalConversor = false;
  pesoEnLibras: number| null = null;
  pesoConvertido: number | null = null;

  abrirModalConversor() {
    this.mostrarModalConversor = true;
  }

  cerrarModalConversor() {
    this.mostrarModalConversor = false;
    this.pesoEnLibras = null;
    this.pesoConvertido = null;
  }

  convertirAPesoKg() {
    if (this.pesoEnLibras) {
      this.pesoConvertido = parseFloat((this.pesoEnLibras * 0.453592).toFixed(1));
    }
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  cargarEstaturas() {
    this.usuariosService.obtenerEstaturas().subscribe(
      (data: any) => {
        this.estaturas = data.estaturas;
      },
      (error) => {
        console.error('Error al cargar las estaturas', error);
      }
    );
  }

  cargarPesos() {
    this.usuariosService.obtenerPesos().subscribe(
      (data: any) => {
        this.pesos = data.pesos;
      },
      (error) => {
        console.error('Error al cargar los pesos', error);
      }
    );
  }

  enviarDatosFisicos() {
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
      this.errorMensaje = 'Usuario no encontrado';
      return;
    }

    const datos = {
      ...this.datosFisicos,
      id_usuario: this.usuarioActual.id_usuario
    };

    this.usuariosService.crearDatosFisicos(datos).subscribe(
      async (response) => {
        // Mostrar alerta de éxito
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Datos físicos agregados exitosamente.',
          buttons: ['OK']
        });
        this.router.navigate(['/inicio']);

        await alert.present();
      },
      (error) => {
        console.error('Error al enviar datos físicos:', error);
      }
    );
  }
}

