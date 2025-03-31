import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicoService } from 'src/app/servicios/medico.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { pacientes } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-pacientes-asistente',
  templateUrl: './pacientes-asistente.page.html',
  styleUrls: ['./pacientes-asistente.page.scss'],
})
export class PacientesAsistentePage implements OnInit {
  usuarioActual: any | null = null;
  pacientes: pacientes[] = [];
  asistentesFiltrados: pacientes[] = [];
  busqueda: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private medicoService: MedicoService,
    private router: Router  // Inyectamos el Router
  ) { }

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarpacientes();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
      //console.error('No se pudo cargar el usuario actual');
    }
  }

  cargarpacientes() {
    if (this.usuarioActual) {
      this.medicoService.obtenerAsistentespacientes(this.usuarioActual.id_usuario).subscribe(
        data => {
          this.pacientes = data.pacientes.map((paciente: pacientes) => {
            if (paciente.foto_base64) {
              paciente.foto_base64 = `data:image/jpeg;base64,${paciente.foto_base64}`;
            }
            return paciente;
          });
          this.asistentesFiltrados = this.pacientes;
        },
        error => {
          //console.error('Error al obtener pacientes:', error);
        }
      );
    }
  }

  buscarAsistentes() {
    const termino = this.busqueda.toLowerCase();
    this.asistentesFiltrados = this.pacientes.filter(paciente =>
      paciente.nombre.toLowerCase().includes(termino) ||
      paciente.apellido.toLowerCase().includes(termino) ||
      paciente.cedula.includes(termino)
    );
  }

  // Nueva función para manejar la selección del paciente
  seleccionarPaciente(paciente: pacientes) {
    this.router.navigate(['/asistente-pacientes'], { state: { paciente } });  // Navegamos al componente y enviamos los datos del paciente
  }
}

