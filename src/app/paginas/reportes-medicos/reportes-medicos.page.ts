import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-medicos',
  templateUrl: './reportes-medicos.page.html',
  styleUrls: ['./reportes-medicos.page.scss'],
})
export class ReportesMedicosPage implements OnInit {
  opcionSeleccionada: string | null = null; // Para almacenar la opción seleccionada

  constructor() {}

  ngOnInit() {}

  mostrarEstadistica(opcion: string) {
    this.opcionSeleccionada = opcion; // Cambia la opción seleccionada
  }
}
