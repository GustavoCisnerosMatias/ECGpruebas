import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ToastController } from '@ionic/angular'; // Importa ToastController

@Component({
  selector: 'app-agregar-medico',
  templateUrl: './agregar-medico.page.html',
  styleUrls: ['./agregar-medico.page.scss'],
})
export class AgregarMedicoPage implements OnInit {
  listaMedicos: any[] = []; // Arreglo para almacenar la lista de médicos
  usuarioActual: any | null = null; // Usuario actual, de acuerdo a tu interfaz
  idMedicoSeleccionado: number | null = null; // Variable para almacenar el ID del médico seleccionado
  medicosPorUsuario: any[] = []; // Arreglo para almacenar la lista de médicos
  medicosFiltrados: any[] = [];  // Lista filtrada
  searchTerm: string = '';       // Término de búsqueda
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private toastController: ToastController // Inyecta ToastController
  ) {}

  ngOnInit() {
    this.obtenerMedicos();
    this.cargarUsuarioActual();
    //this.obtenerMedicosPorUsuario();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      
      this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario);// Lógica adicional si se requiere cargar datos del usuario actual
    }
  }

  obtenerMedicos() {
    this.medicoService.obtenerMedicos().subscribe(
      (response) => {
        this.listaMedicos = response.medicos;
        //console.log(this.listaMedicos)
      },
      (error) => {
       // console.error('Error al obtener la lista de médicos', error);
      }
    );
  }

  // Método para manejar la selección del médico
  seleccionarMedico(event: any) {
    this.idMedicoSeleccionado = event.detail.value;
  }

  // Método para guardar la relación médico-paciente al hacer clic en el botón
  async guardarRelacion() {
    if (this.idMedicoSeleccionado && this.usuarioActual && this.usuarioActual.id_usuario) {
      try {
        await this.medicoService.guardarRelacionMedicoPaciente(this.usuarioActual.id_usuario, this.idMedicoSeleccionado).toPromise();
        
        this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario);
        /* setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 2000); */
      } catch (error) {
        //console.error('Error al guardar la relación médico-paciente', error);
        this.mostrarMensaje('Error al guardar la relación médico-paciente');
      }
    } else {
      //console.error('Error: No se pudo guardar la relación médico-paciente. Datos incompletos.');
      this.mostrarMensaje('Error: Datos incompletos');
    }
  }

  // Método para mostrar un mensaje toast
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      /* duration: 2000, */ // Duración del mensaje en milisegundos
      position: 'bottom' // Posición del mensaje en la pantalla
    });
    toast.present();
  }

//listar
obtenerMedicosPorUsuario(id_usuario: number) {
  this.medicoService.obtenerMedicosPorUsuario(id_usuario).subscribe(
    (response) => {
      //console.log('Datos obtenidos por usuario:', response);

      // Ordenar los médicos: 'A' al inicio, 'I' al final
      this.medicosPorUsuario = response.sort((a: any, b: any) => {
        if (a.estado === 'A' && b.estado === 'I') {
          return -1; // 'A' va primero
        } else if (a.estado === 'I' && b.estado === 'A') {
          return 1; // 'I' va después
        }
        return 0; // Si ambos son iguales, no cambia el orden
      });
      this.medicosFiltrados = [...this.medicosPorUsuario];
     // console.log('Médicos ordenados por estado:', this.medicosPorUsuario);
    },
    (error) => {
      console.error('Error al obtener médicos por usuario', error);
    }
  );
}

/* async eliminarMedico(medico: any) {
  try {
    // Suponiendo que el objeto 'medico' contiene una propiedad 'id_medpaci' que es el ID de la relación
    await this.medicoService.eliminarRelacionMedicoPaciente(medico.id_medpaci).toPromise();
    this.mostrarMensaje('Médico eliminado exitosamente');
    // Actualiza la lista después de eliminar
    this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario);
  } catch (error) {
    console.error('Error al eliminar el médico', error);
    this.mostrarMensaje('Error al eliminar el médico');
  }
} */

  async cambiarEstadoMedico(medico: any, nuevoEstado: string) {
    try {
      await this.medicoService.actualizarEstadoMedicoPaciente(medico.id_medpaci, nuevoEstado).toPromise();
      this.mostrarMensaje(`Médico ${nuevoEstado === 'A' ? 'habilitado' : 'inhabilitado'} exitosamente`);
      this.obtenerMedicosPorUsuario(this.usuarioActual.id_usuario); // Refresca la lista de médicos
    } catch (error) {
      console.error('Error al cambiar el estado del médico', error);
      this.mostrarMensaje('Error al cambiar el estado del médico');
    }
  }
  
  //filtrar para buscar
  filtrarMedicos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    
    this.medicosFiltrados = this.medicosPorUsuario.filter(medico =>
      medico.nombre.toLowerCase().includes(searchTerm) || medico.apellido.toLowerCase().includes(searchTerm)
    );
  }

}
