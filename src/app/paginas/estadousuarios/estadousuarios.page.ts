import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
 // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-estadousuarios',
  templateUrl: './estadousuarios.page.html',
  styleUrls: ['./estadousuarios.page.scss'],
})
export class EstadousuariosPage implements OnInit {
  usuarios: any[] = [];
  searchText: string = '';
  
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuariosService.listarusuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.datos; // Asume que `datos` contiene la lista de usuarios
      },
      error: (err) => {
       // console.error('Error al obtener usuarios:', err);
      }
    });
  }

  buscarUsuarios() {
    if (this.searchText.trim() === '') {
      this.obtenerUsuarios();
    } else {
      this.usuarios = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        usuario.cedula.includes(this.searchText)
      );
    }
  }

  editarUsuario(id: number) {
    this.router.navigate(['/editartodousuario', id]);
  }
}
