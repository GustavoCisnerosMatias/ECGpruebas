import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importar AlertController
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { MedicoService } from 'src/app/servicios/medico.service';

@Component({
  selector: 'app-datosmedico',
  templateUrl: './datosmedico.page.html',
  styleUrls: ['./datosmedico.page.scss'],
})
export class DatosmedicoPage implements OnInit {
  id: number = 0; // ID del usuario
  datosMedico: any = {
    estado: 'A'
  };
  listaCentro: any[] = [];
  listaespecialidad: any[] = [];
  idcentroSeleccionado: number | null = null;
  idespeciadadSeleccionado: number | null = null;
  aceptaCondiciones: boolean = false; // Nueva propiedad
  aceptaPolitica: boolean = false; // Nueva propiedad
  // Variables para horarios
  horaInicio: string = '';
  horaFin: string = '';
  lunes: boolean = false;
  martes: boolean = false;
  miercoles: boolean = false;
  jueves: boolean = false;
  viernes: boolean = false;
  sabado: boolean = false;
  domingo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private alertController: AlertController // Inyectar AlertController
  ) {}

  ngOnInit() {
    // Obtener id_usuario directamente de los queryParams
    this.route.queryParams.subscribe(params => {
      this.id = params['id_usuario'] || 0; // Asigna el id_usuario
      if (this.id > 0) {
       // console.log('ID del usuario recibido:', this.id);
      } else {
        //console.error('El id_usuario no puede estar vacío');
        this.presentAlert('Error: No se recibió el ID del usuario.');
      }
    });
    this.obtenerCentro();
    this.obtenerespecialidad();
  }

   // Función para mostrar alertas
   async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert' // Clase CSS personalizada
    });
    

    await alert.present();
  }

  obtenerCentro() {
    this.medicoService.obtenercentro_hospitalario().subscribe(
      (response) => {
        this.listaCentro = response.centro;
        //console.log(this.listaCentro);
      },
      (error) => {
        //console.error('Error al obtener la lista de centro', error);
      }
    );
  }

  // Método para manejar la selección del médico
  seleccionarCentro(event: any) {
    this.idcentroSeleccionado = event.detail.value;
    this.datosMedico.id_centro = this.idcentroSeleccionado; // Actualizar el objeto
  }

  seleccionarEspecialidad(event: any) {
    this.idespeciadadSeleccionado = event.detail.value;
    this.datosMedico.id_especialidad = this.idespeciadadSeleccionado; // Actualizar el objeto
  }

  obtenerespecialidad() {
    this.medicoService.obtenerespecialidad().subscribe(
      (response) => {
        this.listaespecialidad = response.especialidad;
        //console.log(this.listaespecialidad);
      },
      (error) => {
        //console.error('Error al obtener la lista de especialidades', error);
      }
    );
  }

  // Función para enviar los datos del médico y horarios
// Función para enviar los datos del médico y horarios
onSubmit() {
  if (!this.datosMedico.id_centro || !this.datosMedico.id_especialidad) {
      this.presentAlert('Por favor, seleccione un centro hospitalario y una especialidad.');
      return;
  }
  if (!this.aceptaCondiciones || !this.aceptaPolitica) {
    this.presentAlert('Debes aceptar los términos y condiciones y la política de privacidad.');
    return;
  }
  // Agrupamos los datos del médico
  const datosMedico = {
      id_usuario: this.id, // Ahora utilizamos el id_usuario
      id_centro: this.idcentroSeleccionado,
      id_especialidad: this.idespeciadadSeleccionado,
      ...this.datosMedico
  };
 
   

  // Llamada al servicio para crear los datos del médico
  this.medicoService.creardatosUsuario(datosMedico).subscribe({
      next: (response) => {
          //console.log('Datos del médico creados con éxito:', response);
          // Mostrar el mensaje de éxito
          
          // Ahora enviamos los horarios por separado
          const horarios = {
              id_usuario: this.id, // Reutilizamos el id_usuario
              hora_inicio: this.horaInicio,
              hora_fin: this.horaFin,
              lunes: this.lunes,
              martes: this.martes,
              miercoles: this.miercoles,
              jueves: this.jueves,
              viernes: this.viernes,
              sabado: this.sabado,
              domingo: this.domingo
          };

          // Llamada al servicio para crear los horarios
          this.medicoService.creardatosHorarios(horarios).subscribe({
              next: (horarioResponse) => {
                 // console.log('¡Tu usuario a sido creado con exito!:', horarioResponse);
                  this.presentAlert(`
                      ¡Tu usuario ha sido creado con éxito!...
                      Si necesitas realizar alguna modificación, puedes hacerlo iniciando sesión en tu cuenta.
                   
                  `); // Mostrar el mensaje de éxito
                  this.router.navigate(['/autentificacion']);
              },
              error: (horarioErr) => {
                //  console.error('Error al crear los horarios:', horarioErr);
                  this.presentAlert('Error al crear los horarios'); // Mostrar un mensaje de error
              }
          });
      },
      error: (err) => {
          //console.error('Error al crear los datos del médico:', err);
          this.presentAlert('Error al crear los datos del médico'); // Mostrar un mensaje de error
      }
  });
}
redirigirCondiciones() {
  this.router.navigate(['/proteciondedatos']);
}

redirigirPolitica() {
  this.router.navigate(['/politicas']);
}

}
