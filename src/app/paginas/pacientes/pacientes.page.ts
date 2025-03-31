import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { ChatService } from 'src/app/servicios/chat.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
})
export class PacientesPage implements OnInit {

  listaMedicos: any[] = []; // Arreglo para almacenar la lista de médicos
  usuarioActual: any | null = null; // Usuario actual, de acuerdo a tu interfaz
  idMedicoSeleccionado: number | null = null; // Variable para almacenar el ID del médico seleccionado
  medicosPorUsuario: any[] = []; // Arreglo para almacenar la lista de médicos
  pacientesFiltrados: any[] = []; // Arreglo para almacenar la lista de pacientes filtrados
  searchTerm: string = ''; // Término de búsqueda
  nuevosChats: number = 0;
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private toastController: ToastController ,// Inyecta ToastController
    private chatService: ChatService,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obtenerMedicos();
    this.cargarUsuarioActual();
    this.cargarChatsNuevos();
  }
  cargarChatsNuevos() {
    if (this.usuarioActual && this.pacientesFiltrados.length > 0) {
      const ids_usuarios = this.pacientesFiltrados.map(paciente => paciente.id_usuario);
      const ids_medicos = [this.usuarioActual.id_usuario]; // ID del médico actual
  
      this.chatService.Listarchatnuevomeditodos(ids_usuarios, ids_medicos).subscribe(
        response => {
          if (response && Array.isArray(response)) {
            // Asignar el conteo de chats a cada paciente filtrado
            this.pacientesFiltrados.forEach(paciente => {
              const chatInfo = response.find(chat => chat.id_usuario === paciente.id_usuario);
              paciente.nuevosChats = chatInfo ? chatInfo.chats : 0; // Asignar el conteo o 0 si no hay chats nuevos
            });
            this.cdr.detectChanges(); // Forzar la detección de cambios
          }
        },
        error => {
          console.error('Error al cargar los chats nuevos:', error);
        }
      );
    }
  }
  

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.obtenerpacientesPorUsuario(this.usuarioActual.id_usuario);
    }
  }

  obtenerMedicos() {
    this.medicoService.obtenerMedicos().subscribe(
      (response) => {
        this.listaMedicos = response.medicos;
      },
      (error) => {
        //console.error('Error al obtener la lista de médicos', error);
      }
    );
  }

  obtenerpacientesPorUsuario(id_usuario: number) {
    this.medicoService.obtenerpacientes(id_usuario).subscribe(
      (response) => {
        console.log('Datos obtenidos por usuario:', response);
        this.medicosPorUsuario = response;
        this.pacientesFiltrados = response; 
        this.cargarChatsNuevos(); // Inicialmente, todos los pacientes están filtrados
      },
      (error) => {
       // console.error('Error al obtener pacientes por usuario', error);
      }
    );
  }

  filtrarPacientes(event: any) {
    const valorBusqueda = event.detail.value.toLowerCase();
    this.pacientesFiltrados = this.medicosPorUsuario.filter(paciente =>
      paciente.nombre.toLowerCase().includes(valorBusqueda) ||
      paciente.apellido.toLowerCase().includes(valorBusqueda)
    );
    this.cargarChatsNuevos(); // Actualiza el conteo al filtrar
  }
  

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del mensaje en milisegundos
      position: 'bottom' // Posición del mensaje en la pantalla
    });
    toast.present();
  }

  verDetallePaciente(id_usuario: number, nombre: string, apellido: string, cedula: string, telefono: string) {
    this.router.navigate(['/detalle-paciente'], {
      state: {
        paciente: {
          id_usuario,
          nombre,
          apellido,
          cedula,
          telefono
        }
      }
    });
  }
}
