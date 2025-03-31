import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-historial-medi-paci',
  templateUrl: './historial-medi-paci.page.html',
  styleUrls: ['./historial-medi-paci.page.scss'],
})
export class HistorialMediPaciPage implements OnInit {
  paciente: any = {}; // Se usará para pasar a los componentes
  selectedOption: string | null = '';


  isLargeScreen: boolean = false;

  usuarioActual: any | null = null;
  
  menuOptions = [
    { value: 'antecePerson', icon: 'clipboard-outline', label: 'Antecedente personal' },
    { value: 'trataAnte', icon: 'bandage-outline', label: 'Recetas médicas' },
    // Agrega más opciones según sea necesario
  ];

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit() {

    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.cargarUsuarioActual();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.paciente = navigation.extras.state['paciente'];
    }

    if (this.usuarioActual && !this.paciente.id_usuario) {
      this.paciente.id_usuario = this.usuarioActual.id_usuario;
      this.paciente.nombre = this.usuarioActual.nombre;
    }
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 768;
  }

  selectMenuOption(optionValue: string) {
    this.selectedOption = optionValue;
  }

  deselectOption() {
    this.selectedOption = null;
  }
}
