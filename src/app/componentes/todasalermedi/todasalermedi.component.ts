import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { alertasme } from 'src/app/interfaces/interface';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-todasalermedi',
  templateUrl: './todasalermedi.component.html',
  styleUrls: ['./todasalermedi.component.scss'],
})
export class TodasalermediComponent  implements OnInit {
  usuarioActual: any | null = null;
  alertas: alertasme[] = []; 
  constructor(  
    private alertasService: AlertasService,
    public router: Router,
    private usuariosService: UsuariosService,) { }

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarAlertas();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
    if (!this.usuarioActual || !this.usuarioActual.id_usuario) {
     // console.error('No se pudo cargar el usuario actual');
      //console.log(this.usuarioActual.id_usuario);
    }
  }

  cargarAlertas() {
    if (this.usuarioActual) {
      this.alertasService.cargartodasAlertasmedi(this.usuarioActual.id_usuario).subscribe(response => {
       
        //console.log('Respuesta completa:', response.Alertas);
        this.alertas = response.Alertas;
      
    }, error => {
      console.error('Error al cargar alertas', error);
    });
  }
}

}
