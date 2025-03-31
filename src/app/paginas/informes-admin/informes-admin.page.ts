import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informes-admin',
  templateUrl: './informes-admin.page.html',
  styleUrls: ['./informes-admin.page.scss'],
})
export class InformesAdminPage implements OnInit {
  opcionSeleccionada: string | null = null; // Para almacenar la opción seleccionada

  constructor() {}

  ngOnInit() {}

  mostrarEstadistica(opcion: string) {
    this.opcionSeleccionada = opcion; // Cambia la opción seleccionada
  }
}

