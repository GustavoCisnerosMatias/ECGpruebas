import { Component, OnInit, Input } from '@angular/core';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { alertas } from 'src/app/interfaces/interface';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
})
export class AlertasComponent implements OnInit {
  @Input() id_usuario!: number;
  alertas: alertas[] = [];
  selectedAlertId: number | null = null;
  selectedNoteOption: string = '';
  listaNota: any[] = [];
  idnotaSeleccionado: number | null = null;

  constructor(private alertController: AlertController, private router: Router, private alertasService: AlertasService) {}

  ngOnInit() {
    this.cargarAlertas();
    this.obtenerNota();
  }

  obtenerNota() {
    this.alertasService.obtenernotas().subscribe(
      (response) => {
        this.listaNota = response.nota;
       // console.log(this.listaNota);
      },
      (error) => {
        //console.error('Error al obtener la lista de notas', error);
      }
    );
  }

  // Método para manejar la selección de notas
  seleccionarNotas(event: any) {
    this.idnotaSeleccionado = event.detail.value;
  }

  cargarAlertas() {
    if (this.id_usuario) {
      this.alertasService.cargarAlertas(this.id_usuario);
      this.alertasService.alertas$.subscribe({
        next: (alertas) => {
          // Asegurar que 'alertas' es un arreglo antes de usarlo
          this.alertas = Array.isArray(alertas) ? alertas.filter((alerta) => alerta.vista === 'Nuevo') : [];
        },
        error: (err) => {
          //console.error('Error al cargar alertas:', err);
          this.alertas = []; // En caso de error, establece un arreglo vacío
        }
      });
    }
  }
  
  

  marcarVista(id_alertas: number) {
    this.alertasService.actualizarVistaAlerta(id_alertas).subscribe(() => {
      this.cargarAlertas();
    });
  }

  Todas_alertas() {
    this.router.navigate(['/todasalertas']);
  }

  // Función para mostrar alertas
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para mostrar el formulario para agregar notas
  showAddNoteForm(id_alertas: number) {
    this.selectedAlertId = id_alertas; // Guardar el id de la alerta seleccionada
  }

  guardarNota() {
    if (!this.idnotaSeleccionado) {
      this.presentAlert('Por favor, seleccione un centro hospitalario y una especialidad.');
      return;
    }
    const datosusuario = {
      id_alertas: this.selectedAlertId, // Ahora utilizamos el id_alertas
      id_estadousuario: this.idnotaSeleccionado, // Cambiar a idnotaSeleccionado
    };

    // Llamada al servicio para crear la nota
    this.alertasService.crearnotas_alertas(datosusuario).subscribe({
      next: (response) => {
        //console.log('Respuesta recibida:', response);
    
        // Verificar si el mensaje es de éxito
        if (response && response.mensaje === "Estado creado exitosamente") {
          this.presentAlert(response.mensaje); // Mostrar mensaje de éxito
          
        }else{this.presentAlert('Nota duplicada');}
      },
      error: (err) => {
       // console.error('Error al crear el estado:', err);
    
        // Verificar si el error es por duplicación de clave
        if (err.error && err.error.mensaje && err.error.mensaje==="Error al crear : Error al crear estado: SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '5-3' for key 'unique_alerta_estado'") {
          this.presentAlert('Nota duplicada'); // Mostrar mensaje de duplicado
        } else {
          // Mostrar el mensaje de error genérico
          this.presentAlert('Error al crear el estado'); 
        }
      }
    });
  }
}
