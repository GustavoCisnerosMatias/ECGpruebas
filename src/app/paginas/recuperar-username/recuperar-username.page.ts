import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-recuperar-username',
  templateUrl: './recuperar-username.page.html',
  styleUrls: ['./recuperar-username.page.scss'],
})
export class RecuperarUsernamePage implements OnInit {
  emailForm: FormGroup;
  resetForm: FormGroup;
  isResetVisible: boolean = false;

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuariosService,
    private formBuilder: FormBuilder,private router: Router,
  ) {
    // Inicializar formularios
    this.emailForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
      nuevo_username: ['', [Validators.required]]
    } )// Validación para confirmar la contraseña
  }

  ngOnInit() {}



  async enviarCorreo() {
    const { correo } = this.emailForm.value;
    
    try {
      const response = await this.usuarioService.Recuperar_usuario({ correo }).toPromise();
      
      if (response.mensaje === 'Correo enviado.') {
        // Mostrar el formulario de restablecimiento de contraseña
        this.isResetVisible = true;
        this.resetForm.patchValue({ correo }); // Establecer el correo en el segundo formulario
        this.mostrarAlerta('Codigo de recuperación enviado.', response.mensaje);
      } else {
        // Mostrar mensaje de error si la respuesta es diferente
        this.isResetVisible = false; // Ocultar el formulario de restablecimiento si había un error
        this.mostrarAlerta('Error', response.mensaje || 'No se pudo enviar el correo, intenta nuevamente.');
      }
    } catch (error) {
      // Manejo de errores, como problemas de conexión con la API
      this.isResetVisible = false; // Asegurarse de que el formulario de restablecimiento esté oculto
      this.mostrarAlerta('Error', 'Hubo un problema al enviar el correo. Intenta nuevamente más tarde.');
    }
  }
  

  async actualizarContrasena() {
    const { correo, token, nuevo_username } = this.resetForm.value;
    const response = await this.usuarioService.actualizar_usuario({ correo, token, nuevo_username }).toPromise();

    if (response.mensaje) {
      this.mostrarAlerta('Éxito', response.mensaje);
      this.resetForm.reset(); // Limpiar el formulario
      this.isResetVisible = false; // Ocultar el formulario de restablecimiento
      this.router.navigate(['/autentificacion']);
    } else {
      this.mostrarAlerta('Error', 'No se pudo actualizar la contraseña, intenta nuevamente.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
