import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage implements OnInit {
  idUsuario: number | null = null;
  nombre: string = '';
  apellido: string = '';
  cedula: string = '';
  telefono: string = '';
  paciente: any; // Se usará para pasar a los componentes
  selectedOption: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.paciente = navigation.extras.state['paciente']; // Almacena el paciente completo
      this.idUsuario = this.paciente.id_usuario;
      this.nombre = this.paciente.nombre;
      this.apellido = this.paciente.apellido;
      this.cedula = this.paciente.cedula;
      this.telefono = this.paciente.telefono;
    }
  }

  selectMenuOption(option: string) {
    this.selectedOption = option; // Cambia la opción seleccionada
  }
}
