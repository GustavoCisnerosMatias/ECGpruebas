import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor( private router:Router,private toastController: ToastController) { }
//URLAPI: string = 'https://brown-snail-350616.hostingersite.com/APILeccionP2'
// URLAPI: string = 'https://monitoringiot.website/APILeccionP2'
    URLAPI: string = 'http://127.0.0.1/api-main'


    // http://127.0.0.1/inventario/
 //  public urlServidor:string="/assets/BD/";

  irPagina(url:string){
    this.router.navigate([url]);
  }
  async mostrarMensajeExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración del toast en milisegundos
      color: 'success' // Color del toast
    });
    toast.present(); // Muestra el toast en pantalla
  }

  async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000, // Duración del toast en milisegundos
      color: 'danger' // Color del toast
    });
    toast.present(); // Muestra el toast en pantalla
  }
}
