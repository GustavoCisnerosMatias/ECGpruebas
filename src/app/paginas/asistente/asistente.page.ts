import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asistente',
  templateUrl: './asistente.page.html',
  styleUrls: ['./asistente.page.scss'],
})
export class AsistentePage implements OnInit {
  mostrarCrearUsuario: boolean = false;
  mostrarEditarUsuario: boolean = false;

  constructor() { }

  ngOnInit() { }

  toggleComponente(tipo: string) {
    if (tipo === 'crear') {
      this.mostrarCrearUsuario = !this.mostrarCrearUsuario;
      this.mostrarEditarUsuario = false; // Oculta el componente de editar si está abierto
    } else if (tipo === 'editar') {
      this.mostrarEditarUsuario = !this.mostrarEditarUsuario;
      this.mostrarCrearUsuario = false; // Oculta el componente de crear si está abierto
    }
  }

}
