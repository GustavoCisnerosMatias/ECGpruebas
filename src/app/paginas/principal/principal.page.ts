import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Método para redirigir a la sección de autenticación
  navigateToLogin() {
    this.router.navigate(['/autentificacion']);
  }

  // Método para redirigir a la descarga de la aplicación móvil
navigateToDownloadApp() {
  window.location.href = 'assets/BD/app-debug.apk'; // Ruta al archivo APK en la carpeta assets
}

}

