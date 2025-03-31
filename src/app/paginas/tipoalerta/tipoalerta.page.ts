import { Component, OnInit } from '@angular/core';
import { tipoalerta, Parametro, RespuestaParametros } from 'src/app/interfaces/interface';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ParametrosService } from 'src/app/servicios/parametros.service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tipoalerta',
  templateUrl: './tipoalerta.page.html',
  styleUrls: ['./tipoalerta.page.scss'],
})
export class TipoalertaPage implements OnInit {
  tiposAlertas: tipoalerta[] = [];
  parametros: Parametro[] = [];
  nuevoTipo: tipoalerta = {
    id_tipoalerta: 0,
    nombre_alerta: '',
    descripcion: '',
    estado: 'A',
    rango_min: '',
    rango_max: '',
    edad_min: 0,
    edad_max: 0,
    genero: null, // Inicialmente null
    fecha: '',
    id_parametro: 0, // Cambiado a 0
  };
  mostrarFormulario = false;
  modoEdicion = false; // Variable para manejar el modo edición

  constructor(private alertasService: AlertasService, private parametrosService: ParametrosService, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarTiposAlertas();
    this.cargarParametros();
  }

  toggleFormularioNuevo() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.modoEdicion = false; // Reiniciar modo edición al mostrar formulario
  }

  cargarTiposAlertas() {
    this.alertasService.obtenertipoalerta().subscribe((data) => {
      this.tiposAlertas = data.TipoAlertas || [];
    });
  }

  cargarParametros() {
    this.parametrosService.obtenerParametros().subscribe((respuesta: RespuestaParametros) => {
      this.parametros = respuesta.datos || [];
    });
  }

  crearTipoAlerta() {
    // Aquí no se necesita verificar que todos los campos estén completos
    this.alertasService.creartiposdealerta(this.nuevoTipo).subscribe((response) => {
      this.cargarTiposAlertas();
      this.resetFormulario();
      this.mostrarFormulario = false;
    });
  }

  editarTipoAlerta(tipo: tipoalerta) {
    this.modoEdicion = true; // Activar modo edición
    this.nuevoTipo = { ...tipo }; // Cargar los datos del tipo de alerta seleccionado
    this.mostrarFormulario = true; // Mostrar el formulario
  }

  guardarCambios() {
    // Verificar que todos los campos estén completos
    if (!this.nuevoTipo.nombre_alerta || !this.nuevoTipo.descripcion || !this.nuevoTipo.rango_min || !this.nuevoTipo.rango_max || this.nuevoTipo.id_parametro === null ) {
      this.presentAlert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  // Convertir nombre y descripción a mayúsculas
  this.nuevoTipo.nombre_alerta = this.nuevoTipo.nombre_alerta.toUpperCase();
  this.nuevoTipo.descripcion = this.nuevoTipo.descripcion.toUpperCase();
 // Convertir género a mayúsculas si tiene valor, o asignar null si no está seleccionado
  this.nuevoTipo.genero = this.nuevoTipo.genero ? this.nuevoTipo.genero.toUpperCase() : null;

  
    if (this.modoEdicion) {
      // Si está en modo edición, actualizar el tipo de alerta existente
      this.alertasService.editartiposdealerta(this.nuevoTipo).subscribe(() => {
        this.cargarTiposAlertas(); // Cargar los tipos de alertas nuevamente
        this.resetFormulario(); // Reiniciar el formulario
        this.mostrarFormulario = false; // Ocultar el formulario después de guardar
        this.modoEdicion = false; // Reiniciar modo de edición
      }, error => {
        // Manejo de errores si es necesario
        this.presentAlert('Error al editar el tipo de alerta.');
      });
    } else {
      // Si no está en modo edición, crear un nuevo tipo de alerta
      this.alertasService.creartiposdealerta(this.nuevoTipo).subscribe((response) => {
        this.cargarTiposAlertas(); // Cargar los tipos de alertas nuevamente
        this.resetFormulario(); // Reiniciar el formulario
        this.mostrarFormulario = false; // Ocultar el formulario después de guardar
      }, error => {
        // Manejo de errores si es necesario
        this.presentAlert('Error al crear el tipo de alerta.');
      });
    }
  }
  
  
  resetFormulario() {
    this.nuevoTipo = {
      id_tipoalerta: 0,
      nombre_alerta: '',
      descripcion: '',
      estado: 'A',
      rango_min: '',
      rango_max: '',
      edad_min: 0,
      edad_max: 0,
      genero: null,
      fecha: '',
      id_parametro: 0 // Reiniciar también este campo
    };
  }

  presentAlert(message: string) {
    this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  eliminarTipoAlerta(id_tipoalerta: number) {
    this.alertasService.eliminartipoalerta(id_tipoalerta).subscribe(() => {
      this.cargarTiposAlertas();
    });
  }
}
