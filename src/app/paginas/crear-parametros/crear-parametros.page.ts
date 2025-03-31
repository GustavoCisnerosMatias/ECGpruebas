import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametro, Respuestadata, RespuestaData, RespuestaParametros } from 'src/app/interfaces/interface'; // Corregido 'Respuestadata'
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-crear-parametros',
  templateUrl: './crear-parametros.page.html',
  styleUrls: ['./crear-parametros.page.scss'],
})
export class CrearParametrosPage implements OnInit {
  parametros: Parametro[] = []; // Almacena los parámetros obtenidos
  nuevoParametroForm: FormGroup; // Formulario para agregar nuevo parámetro

  constructor(
    private parametrosService: ParametrosService,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    this.nuevoParametroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      estado: ['A', Validators.required],
      unidad_medida: ['', Validators.required],
      icono: ['']
    });
  }

  ngOnInit() {
    this.obtenerParametros();
  }

  obtenerParametros() {
    this.parametrosService.obtenerParametros().subscribe(
      (respuesta: RespuestaParametros) => {
        this.parametros = respuesta.datos; // Asigna los datos a la variable
      },
      (error: any) => { // Especificando el tipo 'any' para el error
        console.error('Error al obtener parámetros:', error);
        this.presentAlert('Error', 'No se pudieron obtener los parámetros.');
      }
    );
  }

  async agregarParametro() {
    if (this.nuevoParametroForm.invalid) {
        this.presentAlert('Error', 'Por favor complete todos los campos.');
        return;
    }

     // Obtener los valores del formulario y convertir a mayúsculas
  const nuevoParametro: Parametro = {
    ...this.nuevoParametroForm.value,
    nombre: this.nuevoParametroForm.value.nombre.toUpperCase(),
    // Si el icono también debe ir en mayúsculas, puedes agregar:
   
  };

    this.parametrosService.crearparametros(nuevoParametro).subscribe(
        async (respuesta: Respuestadata) => {
          this.presentAlert('Éxito', 'Parámetro creado exitosamente.');
          this.obtenerParametros();
            if (respuesta.success) {
                this.presentAlert('Éxito', 'Parámetro creado exitosamente.');

               
                this.nuevoParametroForm.reset(); // Reinicia el formulario
            } 
        },
        (error: any) => {
            console.error('Error al agregar parámetro:', error);
            this.presentAlert('Error', 'Error al agregar el parámetro.');
        }
    );
}


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  // Método para eliminar un parámetro
 // Método para confirmar la eliminación de un parámetro
 async confirmarEliminacion(id_parametro: number) {
  const alert = await this.alertController.create({
    header: 'Confirmar Eliminación',
    message: '¿Está seguro de que desea eliminar este parámetro?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.eliminarParametro(id_parametro);
        },
      },
    ],
  });

  await alert.present();
}

// Método para eliminar un parámetro
eliminarParametro(id_parametro: number) {
  this.parametrosService.eliminarParametro(id_parametro).subscribe(
    (respuesta: Respuestadata) => {
      this.presentAlert('Éxito', 'Parámetro eliminado exitosamente.');
      this.obtenerParametros();
    },
    (error: any) => {
      console.error('Error al eliminar parámetro:', error);
      this.presentAlert('Error', 'Error al eliminar el parámetro.');
    }
  );
}
  


}
