import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { ChatUsuarioComponent } from 'src/app/componentes/chat-usuario/chat-usuario.component';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-detalle-paciente',
  templateUrl: './detalle-paciente.page.html',
  styleUrls: ['./detalle-paciente.page.scss'],
})
export class DetallePacientePage implements OnInit {
  
  mostrarChat: boolean = false;
  nombre: string = '';
  apellido: string = '';
  cedula: string = '';
  telefono: string = '';
  mostrarActionSheet = false;
  chatAbierto: boolean = false;
  medicoActual: any | null = null;
 
  idUsuario: number = 0;  // Asegúrate de que nunca sea null
  medicoActualId: number = 0; // Guardar el id_medico
  constructor(
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private usuariosService: UsuariosService,
    private medicosService: MedicoService,
    private modalController: ModalController 
  ) {}

  ngOnInit() {
    this.cargarMedicoActual();
    // Usar el estado de navegación para obtener los datos del paciente
    this.obtenerDatosPaciente();
  }

  // Método para obtener los datos del paciente según el estado de navegación
obtenerDatosPaciente() {
  const navigation = this.router.getCurrentNavigation();
  if (navigation && navigation.extras.state) {
    const state = navigation.extras.state;
    if (state && state['paciente']) {
      this.idUsuario = state['paciente']['id_usuario'];
      this.nombre = state['paciente']['nombre'];
      this.apellido = state['paciente']['apellido'];
      this.cedula = state['paciente']['cedula'];
      this.telefono = state['paciente']['telefono'];
    }
  } else {
    //console.error('No se recibieron datos del paciente');
  }
}
 // Cargar el médico actual y obtener los datos de la API
 cargarMedicoActual() {
  this.medicoActual = this.usuariosService.getUsuarioActual();
  if (this.medicoActual && this.medicoActual.id_usuario) {
    // Obtener los datos del médico
    this.medicosService.Obtenerdatosmedicoxid(this.medicoActual.id_usuario).subscribe(
      response => {
        if (response && response.medico && response.medico.length > 0) {
          this.medicoActualId = response.medico[0].id_medico; // Guardar id_medico
        }
      },
      error => {
        //console.error('Error al cargar los datos del médico:', error);
      }
    );
  }
}

 // Método para abrir el chat
 abrirChat() {
  if (this.medicoActualId && this.idUsuario) {
    this.mostrarChat = true;  // Mostrar el chat
  } else {
    //console.error('No se pudo abrir el chat. Faltan IDs de médico o usuario.');
    this.mostrarMensaje('No se puede abrir el chat. Faltan datos del médico o del usuario.');
  }
}
cerrarChat() {
  this.mostrarChat = false; // Cambiar el estado para ocultar el chat
}

navegarAPagina(pagina: string) {
  this.router.navigate([`/${pagina}`], {
    state: { 
      paciente: {
        id_usuario: this.idUsuario,
        nombre: this.nombre,
        apellido: this.apellido,
        cedula: this.cedula,
        telefono: this.telefono
      }
    }
  });
}

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  generarInforme(tipo: string) {
    if (this.idUsuario !== null) {
      this.mostrarMensaje(`Generando informe ${tipo} para el usuario con ID ${this.idUsuario}`);
    } else {
      this.mostrarMensaje('No se pudo generar el informe porque no se encontró el ID de usuario.');
    }
  }

  mostrarDatosActuales() {
    this.mostrarMensaje('Mostrando datos actuales');
  }

  async mostrarMenuInformes() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona ',
      buttons: [
        {
          text: 'Visualizar parámetros',
          handler: () => {
            // Navegar a la página y pasar los datos del paciente
            this.router.navigate(['/vizualizar-parametros'], {
              state: { 
                paciente: {
                  id_usuario: this.idUsuario,
                  nombre: this.nombre,
                  apellido: this.apellido,
                  cedula: this.cedula,
                  telefono: this.telefono
                }
              }
            });
          }
        },
        {
          text: 'Alertas',
          handler: () => {
            // Pasar los datos al generar el informe
            this.router.navigate(['/alertas-medico'], {
              state: { 
                paciente: {
                  id_usuario: this.idUsuario,
                  nombre: this.nombre,
                  apellido: this.apellido,
                  cedula: this.cedula,
                  telefono: this.telefono
                }
              }
            });
          }
        },
        {
          text: 'Consulta',
          handler: () => {
            // Pasar los datos al generar el informe quincenal
            this.router.navigate(['/consultas'], {
              state: { 
                paciente: {
                  id_usuario: this.idUsuario,
                  nombre: this.nombre,
                  apellido: this.apellido,
                  cedula: this.cedula,
                  telefono: this.telefono
                }
              }
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  
  async mostrarOpcionesMensaje(tipo: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona un mensaje',
      buttons: [
        {
          text: 'Le recordamos que tiene una cita programada. Por favor, confirme su asistencia respondiendo a este mensaje.',
          handler: () => this.enviarMensaje(tipo, 'Le recordamos que tiene una cita programada. Por favor, confirme su asistencia respondiendo a este mensaje.')
        },
        {
          text: 'Hola buenos días.',
          handler: () => this.enviarMensaje(tipo, 'Hola buenos días.')
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  enviarMensaje(tipo: string, mensaje: string) {
    let mensajeConUsuario = `${mensaje}\nID del usuario: ${this.idUsuario}`;
    let url = '';

    if (tipo === 'whatsapp') {
      url = `https://api.whatsapp.com/send?phone=${this.telefono}&text=${encodeURIComponent(mensajeConUsuario)}`;
    } else if (tipo === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(mensajeConUsuario)}`;
    }

    window.open(url, '_system');
    this.cerrarActionSheet();
  }

  cerrarActionSheet() {
    this.mostrarActionSheet = false;
  }
}