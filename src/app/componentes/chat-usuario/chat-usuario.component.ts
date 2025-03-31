import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild,ElementRef, AfterViewChecked } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/servicios/chat.service';

import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';

@Component({
  selector: 'app-chat-usuario',
  templateUrl: './chat-usuario.component.html',
  styleUrls: ['./chat-usuario.component.scss'],
})
export class ChatUsuarioComponent implements OnInit, OnChanges {
  @Input() id_usuario: number = 0; // ID del usuario
  @Input() id_medico: number = 0; // ID del médico
  @Output() chatClosed = new EventEmitter<void>(); // Evento para notificar el cierre del chat
  private chatInterval: any;
  mensajes: any[] = []; // Para almacenar los mensajes del chat
  nuevoMensaje: string = ''; // Para almacenar el nuevo mensaje

  constructor(
    private medicoService: ChatService,
    public autentificacionService: SerAutentificacionService ,private modalController: ModalController// Asegúrate de que sea público para acceder en el HTML
  ) {}

  ngOnInit() {
    this.cargarMensajes();
     this.chatInterval = setInterval(() => {
      this.cargarMensajes();
    }, 12000); 
  }
  
  ngOnDestroy() {
    // Limpiar el intervalo al destruir el componente
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
    }
  }

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_usuario'] || changes['id_medico']) {
      this.cargarMensajes(); // Carga los mensajes nuevamente si hay cambios
    }
  }

  cargarMensajes() {
    if (!isNaN(this.id_usuario) && !isNaN(this.id_medico)) {
      const chatData = { id_usuario: this.id_usuario, id_medico: this.id_medico };
      this.medicoService.Listarchat(chatData).subscribe(
        response => {
          this.mensajes = response.chat || [];
          this.mensajes.reverse(); // Invertir para mostrar el último mensaje primero
  
          this.mensajes.forEach(mensaje => {
            // Asegúrate de que 'visto' sea booleano
            mensaje.visto = (mensaje.visto === 1);
  
            // Marcar como visto si el mensaje es de otro rol
            if (mensaje.id_rol !== this.autentificacionService.idRol) {
              this.actualizarpaciente(mensaje.id_mensaje);
              this.actualizarmedico(mensaje.id_mensaje);
            }
          });
  
          // Verificar los mensajes cargados
          //console.log('Mensajes cargados:', this.mensajes);
        },
        error => {
          //console.error('Error al cargar mensajes:', error);
          // Opcional: Mostrar un mensaje al usuario
        }
      );
    } else {
     // console.error('Los IDs no son válidos:', this.id_usuario, this.id_medico);
    }
  }
  
  

  enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') {
      return; // No enviar si el mensaje está vacío
    }

    const mensajeData = {
      id_usuario: this.id_usuario,
      id_medico: this.id_medico,
      mensaje: this.nuevoMensaje,
      id_rol: this.autentificacionService.idRol // Acceder al id_rol del servicio de autenticación
    };

    this.medicoService.Enviarchat(mensajeData).subscribe(
      response => {
        this.mensajes.push(response.mensaje); // Agregar el nuevo mensaje a la lista
        this.nuevoMensaje = ''; // Limpiar el campo de entrada
        this.cargarMensajes(); // Cargar mensajes nuevamente
      },
      error => {
        //console.error('Error al enviar mensaje:', error);
      }
    );
  }

  actualizarpaciente(id_mensaje: number) {
    const actualizarvista = { id_mensaje: id_mensaje };
    this.medicoService.Actualizarvistamensaje(actualizarvista).subscribe(
      response => {
        //console.log('Vista actualizada para el mensaje:', id_mensaje);
      },
      error => {
       // console.error('Error al actualizar la vista del mensaje:', error);
      }
    );
  }
  actualizarmedico(id_mensaje: number) {
    const actualizarvista = { id_mensaje: id_mensaje };
    this.medicoService.Actualizarvistamensaje(actualizarvista).subscribe(
      response => {
        //console.log('Vista actualizada para el mensaje:', id_mensaje);
      },
      error => {
       // console.error('Error al actualizar la vista del mensaje:', error);
      }
    );
  }
  cerrarChat() {
    this.chatClosed.emit();  // Emitir evento de cierre
    this.modalController.dismiss({
      chatClosed: true  // Cerrar modal
    });
  }
}
