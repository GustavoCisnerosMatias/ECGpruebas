import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenu } from 'src/app/interfaces/interface';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ChatService } from 'src/app/servicios/chat.service';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nuevosChats: number = 0;
  private mensajesSub: Subscription | null = null;

  usuarioActual: any | null = null;
  menuOpciones: IMenu[] = [];
  nuevasAlertas: boolean = false;
  mostrarAlertas: boolean = false; // Para controlar si se muestra el componente de alertas
  mostrarParametros: boolean = false; // Para controlar si se muestra el componente ParametrosComponent
  mostrartodasalermedi: boolean = false;
  mostrartelemedicina:boolean = false;
  mostrardatos :boolean = false;
  constructor(
    public router: Router,
    private serAutentificacion: SerAutentificacionService,
    private alertasService: AlertasService,
    private usuariosService: UsuariosService,
    private chatService: ChatService,private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {
    this.menuOpciones = this.serAutentificacion.menu.filter(opcion => opcion.categoria == 1);
    this.cargarUsuarioActual();

    // Verificar si el idRol del usuario es igual a 1
    if (this.serAutentificacion.idRol === 1) {
      this.alertasService.alertas$.subscribe(alertas => {
        this.nuevasAlertas = alertas.some(alerta => alerta.vista === 'Nuevo');
      });
    }

    this.cargarAlertas(); // Cargar alertas al iniciar
     // Cargar los chats nuevos
     this.cargarChatsNuevos();
     this.cargarChatsNuevosmedi();
  }
  cargarChatsNuevosmedi() {
    if (this.usuarioActual) {
      this.chatService
        .Listarchatnuevomedi(this.usuarioActual.id_usuario)
        .subscribe(response => {
          if (response?.chat?.[0]?.total !== undefined) {
            this.nuevosChats = response.chat[0].total;
          }
        });
    }
  }

  cargarChatsNuevos() {
    if (this.usuarioActual) {
      this.chatService
        .Listarchatnuevo(this.usuarioActual.id_usuario)
        .subscribe(response => {
          if (response?.chat?.[0]?.total !== undefined) {
            this.nuevosChats = response.chat[0].total;
          }
        });
    }
  }
  ngAfterViewInit() {
    // Si estás modificando algún valor relacionado con 'color'
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
      //console.error('No se pudo cargar el usuario actual');
    }
  }

  cargarAlertas() {
    if (this.usuarioActual) {
      this.alertasService.cargarAlertas(this.usuarioActual.id_usuario);
    }
  }

  toggleAlertas() {
    this.mostrarAlertas = !this.mostrarAlertas;
    if (this.mostrarAlertas && this.usuarioActual) {
      this.cargarAlertas();
    }
  }

  navegar(men_pagina: string) {
    //console.log('Página seleccionada:', men_pagina);

    if (men_pagina === '/alertas') {
      this.mostrarAlertas = !this.mostrarAlertas;
      this.mostrarParametros = false;
      this.mostrartodasalermedi=false;
      this.cargarChatsNuevos();

      if (this.mostrarAlertas && this.usuarioActual) {
        this.cargarAlertas();
      }
    } else if (men_pagina === '/realtime') {
     // console.log('Mostrando parámetros');
      this.mostrarParametros = !this.mostrarParametros;
      this.mostrarAlertas = false;
      this.mostrartodasalermedi=false;
      this.mostrardatos = false;
    }
    else if (men_pagina === '/todasalermedi') {
     // console.log('Mostrando todas las alertas medic');
      this.mostrartodasalermedi = !this.mostrartodasalermedi;
      this.mostrarAlertas = false;
      this.mostrarParametros = false;
      this.mostrardatos = false;
    }
    else if (men_pagina === '/telemedicina') {
      this.router.navigate([men_pagina]); // Solo navega a la ruta sin alterar banderas
    }else if (men_pagina === '/verdatosfisicos') {
      this.mostrardatos = !this.mostrardatos;
      this.mostrarAlertas = false;
      this.mostrarParametros = false;// Solo navega a la ruta sin alterar banderas
      this.mostrartodasalermedi=false;
    }
    else {
     // console.log('Navegando a otra página:', men_pagina);
      this.mostrarAlertas = false;
      this.mostrarParametros = false;
      this.router.navigate([men_pagina]);
    }
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  salir() {
    // Lógica de cierre de sesión
    this.serAutentificacion.logout();

    // Redirigir a la página de inicio de sesión
    this.router.navigate(['/autentificacion']).then(() => {
      // Bloquear la navegación hacia atrás
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
      };
      location.reload();
    });
  }


 /*  tago() {
    this.router.navigate(['/datostago']);

  }
  realtime() {

    this.router.navigate(['/realtime']);
  } */
}
