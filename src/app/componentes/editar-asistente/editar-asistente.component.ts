import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import { Observable } from 'rxjs';
import { MedicoService } from 'src/app/servicios/medico.service';

@Component({
  selector: 'app-editar-asistente',
  templateUrl: './editar-asistente.component.html',
  styleUrls: ['./editar-asistente.component.scss'],
})
export class EditarAsistenteComponent implements OnInit {
  usuarioActual: any | null = null;
  asistentes: any[] = [];
  filteredAsistentes: any[] = [];
  searchTerm: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private asistentesService: MedicoService
  ) {}

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarAsistentes();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
      //console.error('No se pudo cargar el usuario actual');
    }
  }

  cargarAsistentes() {
    const params = { id_usuario: this.usuarioActual.id_usuario }; // Envía el id_usuario
    this.asistentesService.vizualizarasistente(params).subscribe(
      (data) => {
        this.asistentes = data.asistentes; // Asigna los asistentes a la variable
        // Ordenar los asistentes para que los activos vengan primero
        this.asistentes.sort((a, b) => {
          return a.estado === 'A' ? -1 : 1; // Activos primero
        });
        this.filteredAsistentes = this.asistentes; // Inicializa la lista filtrada
      },
      (error) => {
        //console.error('Error al cargar asistentes', error);
      }
    );
  }
  

  buscarAsistentes() {
    this.filteredAsistentes = this.asistentes.filter((asistente) =>
      `${asistente.nombre} ${asistente.apellido}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  toggleEstado(asistente: any) {
    const nuevoEstado = asistente.estado === 'A' ? 'I' : 'A';
    const actualizarestado = {
      id_asistente: asistente.id_asistente,
      estado: nuevoEstado,
    };

    this.asistentesService.Actualizarestadoasisten(actualizarestado).subscribe(
      () => {
        asistente.estado = nuevoEstado; // Actualiza el estado localmente
        this.cargarAsistentes();
      },
      (error) => {
       // console.error('Error al actualizar estado', error);
      }
    );
  }
}
