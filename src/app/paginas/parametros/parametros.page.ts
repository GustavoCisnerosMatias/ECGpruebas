import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/servicios/web-socket.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: ['./parametros.page.scss']
})
export class ParametrosPage implements OnInit {
  usuarioActual: any | null = null;
  mensajeExito: string = '';
  mensajeError: string = '';
  datos: any = {}; // Almacena solo el primer dato recibido

  idUsuario: string | null = null;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private messageService: GeneralService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual) {
      this.idUsuario = this.usuarioActual.id_usuario;
      this.iniciarConexionWebSocket();
    } else {
      this.mensajeError = 'No se pudo obtener el usuario actual.';
    }
  }

  iniciarConexionWebSocket() {
    if (this.idUsuario) {
      this.webSocketService.sendMessage({ id_usuario: this.idUsuario });
      this.webSocketService.sendMessagePeriodically({ id_usuario: this.idUsuario }, 5000);

      this.webSocketService.getMessages().subscribe(
        (message) => {
          if (Array.isArray(message) && message.length > 0) {
            this.datos = message[0]; // Guarda el primer dato recibido
          }
        },
        (error) => {
          //console.error('Error en el WebSocket', error);
          this.mensajeError = 'Error en la conexión WebSocket.';
        }
      );
    } else {
      this.mensajeError = 'ID de usuario no disponible.';
    }
  }
}

