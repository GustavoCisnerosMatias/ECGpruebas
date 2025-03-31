import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { ChatService } from 'src/app/servicios/chat.service';

@Component({
  selector: 'app-telemedicina',
  templateUrl: './telemedicina.page.html',
  styleUrls: ['./telemedicina.page.scss'],
})
export class TelemedicinaPage implements OnInit {
  medicosPorUsuario: any[] = [];
  usuarioActual: any | null = null;
  mostrarActionSheet = false;
  nombreMedico = '';
  opcionesMensajes: any[] = [];
  busqueda: string = '';
  id_usuario: number = 0; // O el tipo correspondiente
  id_medico: number = 0; // O el tipo correspondiente
  mostrarChat: boolean = false;
  mensajes: { [key: number]: any[] } = {}; // Mensajes por id_medico
  nuevosMensajes: { [key: number]: number } = {}; // Contador de nuevos mensajes por id_medico

  selectedMedico: any; // Definir selectedMedico
  private intervalId: any; // Para almacenar el ID del intervalo
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private me: ChatService,

    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    public autentificacionService: SerAutentificacionService
  ) { }

  ngOnInit() {
    this.cargarUsuarioActual();
    this.startMessageCheck();
  }

  ngOnDestroy() {
    // Limpiar el intervalo al salir de la página
    clearInterval(this.intervalId);
    // Reiniciar el estado
    this.nuevosMensajes = {};
    this.mensajes = {};
  }
  // Esta función se ejecuta cuando la página está por mostrarse
  ionViewWillEnter() {
    if (this.usuarioActual) {
      this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario); // Carga médicos
      this.id_usuario = this.usuarioActual.id_usuario; // Asigna el id_usuario aquí
      // Solo cargamos mensajes de los médicos ya obtenidos
      this.medicosPorUsuario.forEach(medico => {
        this.cargarMensajes(this.id_usuario, medico.id_medico);
      });
    }
  }

  startMessageCheck() {
    // Verifica nuevos mensajes cada 3 segundos
    this.intervalId = setInterval(() => {
      if (this.id_usuario && this.medicosPorUsuario.length > 0) {
        this.medicosPorUsuario.forEach(medico => {
          this.cargarMensajes(this.id_usuario, medico.id_medico); // Cargar mensajes para cada médico
        });
      }
    }, 3000); // 3000 milisegundos = 3 segundos
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario);
    }
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  // Variables de clase

  obtenerMedicosPorUsuario(id_usuario: number) {
    this.medicoService.obtenerMedicosPorUsuario(id_usuario).subscribe(
      (response) => {
        //console.log('Datos obtenidos por usuario:', response);
        this.medicosPorUsuario = response;
        this.medicosPorUsuario.forEach(medico => {
          this.mensajes[medico.id_medico] = []; // Inicializa los mensajes para cada médico
          this.nuevosMensajes[medico.id_medico] = 0; // Inicializa el contador de nuevos mensajes para cada médico
          this.cargarMensajes(id_usuario, medico.id_medico);
        });
      },
      (error) => {
        //console.error('Error al obtener médicos por usuario', error);
      }
    );
  }

  cargarMensajes(id_usuario: number, id_medico: number) {
    const chatData = { id_usuario: id_usuario, id_medico: id_medico };

    this.me.Listarchat(chatData).subscribe(
      response => {
        const nuevosChat = response.chat || [];
        const mensajesPrevios = this.mensajes[id_medico] || [];

        // Actualiza los mensajes
        this.mensajes[id_medico] = [...mensajesPrevios, ...nuevosChat];

        // Contar nuevos mensajes después de añadir
        this.contarNuevosMensajes(id_medico);
        //console.log('Mensajes cargados para el médico:', id_medico, this.mensajes[id_medico]);
      },
      error => {
        //console.error('Error al cargar mensajes:', error);
      }
    );
  }


  private idsMensajesContados: Set<number> = new Set<number>();


  contarNuevosMensajes(id_medico: number) {
   // console.log('Contando nuevos mensajes para el médico:', id_medico);
    const mensajes = this.mensajes[id_medico] || [];
    let nuevosMensajesCount = this.nuevosMensajes[id_medico] || 0; // Mantiene el conteo actual
    const idRolActual = this.autentificacionService.idRol; // Obtiene el ID de rol actual

    mensajes.forEach(mensaje => {
      // Contar nuevos mensajes que no han sido vistos y no han sido contados antes
      if (mensaje.visto === 0 && !this.idsMensajesContados.has(mensaje.id_mensaje) && mensaje.id_rol !== idRolActual) {
        nuevosMensajesCount++;
        this.idsMensajesContados.add(mensaje.id_mensaje); // Agrega el ID del mensaje al conjunto
      }

      // Si el mensaje ha sido visto y estaba en el conjunto, decrementar el contador
      if (mensaje.visto === 1 && this.idsMensajesContados.has(mensaje.id_mensaje)) {
        nuevosMensajesCount = Math.max(nuevosMensajesCount - 1, 0); // Asegúrate de que no sea negativo
        this.idsMensajesContados.delete(mensaje.id_mensaje); // Elimina el ID del conjunto
      }
    });

    // Actualiza el conteo de nuevos mensajes solo si hay nuevos mensajes
    this.nuevosMensajes[id_medico] = Math.max(nuevosMensajesCount, 0); // Evita conteos negativos
  }




  medicosFiltrados() {
    return this.medicosPorUsuario.filter(medico => {
      const nombreCompleto = `${medico.nombre} ${medico.apellido}`.toLowerCase();
      return nombreCompleto.includes(this.busqueda.toLowerCase());
    });
  }

  mostrarOpcionesMensaje(medico: any, tipo: string) {
    this.nombreMedico = medico.nombre + ' ' + medico.apellido;
    // Obtener los horarios del médico
    this.medicoService.listarhorariosxid_medico(medico.id_medico).subscribe(
      (response) => {
        const horarios = response.horarios[0]; // Asumiendo que solo hay un conjunto de horarios
        const diaActual = new Date().getDay(); // Obtener el día actual (0 es domingo, 6 es sábado)
        const horaActual = new Date().toTimeString().split(' ')[0]; // Obtener la hora actual en formato HH:MM:SS
        // Verificar si el médico atiende el día de hoy
        const diaHabilitado = this.verificarDia(diaActual, horarios);
        if (diaHabilitado && this.verificarHorario(horaActual, horarios.hora_inicio, horarios.hora_fin)) {
          // Mostrar opciones solo si el médico está disponible en este momento
          this.opcionesMensajes = [
            {
              text: 'Me gustaría agendar una cita.',
              handler: () => this.enviarMensaje(medico, tipo, 'Me gustaría agendar una cita.')
            },
            {
              text: 'Tengo una consulta sobre un tratamiento.',
              handler: () => this.enviarMensaje(medico, tipo, 'Tengo una consulta sobre un tratamiento.')
            },
            {
              text: 'Necesito renovar una receta.',
              handler: () => this.enviarMensaje(medico, tipo, 'Necesito renovar una receta.')
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ];
          this.mostrarActionSheet = true;
        } else {
          // Mostrar un mensaje indicando que el médico no está disponible
          this.mostrarMensaje('El médico esta fuera del horario disponible dejar un mensaje en el chat directo.');
        }
      },
      (error) => {
       // console.error('Error al obtener horarios del médico', error);
        this.mostrarMensaje('No se pudo obtener la disponibilidad del médico.');
      }
    );
  }
  verificarDia(diaActual: number, horarios: any): boolean {
    // Verifica si el día actual está habilitado según la API (lunes es 1, domingo es 0)
    switch (diaActual) {
      case 1: return horarios.lunes === 1;
      case 2: return horarios.martes === 1;
      case 3: return horarios.miercoles === 1;
      case 4: return horarios.jueves === 1;
      case 5: return horarios.viernes === 1;
      case 6: return horarios.sabado === 1;
      case 0: return horarios.domingo === 1;
      default: return false;
    }
  }
  verificarHorario(horaActual: string, horaInicio: string, horaFin: string): boolean {
    return horaActual >= horaInicio && horaActual <= horaFin;
  }

  cerrarActionSheet() {
    this.mostrarActionSheet = false;
  }

  enviarMensaje(medico: any, tipo: string, mensaje: string) {
    const telefono = medico.telefono;
    // Asume que el teléfono está en los datos del médico
    let url = '';
    if (tipo === 'whatsapp') {
      url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    } else if (tipo === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(mensaje)}`;
    }
    window.open(url, '_system');
    this.cerrarActionSheet();
  }


  irAChat(medico: any) {
    const id_usuario = this.usuarioActual?.id_usuario; // Asegúrate de que esto esté definido
    const id_medico = medico.id_medico;

    if (id_usuario && id_medico) {
      this.mostrarChat = true; // Cambia el estado para mostrar el chat
      this.id_usuario = id_usuario;
      this.id_medico = id_medico;
    } else {
      console.error('Error: id_usuario o id_medico no están definidos');
    }
  }
  cerrarChat() {
    this.mostrarChat = false; // Cambiar el estado para ocultar el chat
  }

}
