import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {
  emailForm: FormGroup;
  resetForm: FormGroup;
  isResetVisible: boolean = false;
  showPassword: boolean = false; // Para mostrar/ocultar nueva contraseña
  showConfirmPassword: boolean = false; // Para mostrar/ocultar confirmar contraseña

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
      nueva_contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmar_contrasena: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.passwordMatchValidator }); // Validación para confirmar la contraseña
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('nueva_contrasena')?.value === form.get('confirmar_contrasena')?.value
      ? null : { mismatch: true };
  }

  async enviarCorreo() {
    const { correo } = this.emailForm.value;
    
    try {
      const response = await this.usuarioService.Recuperar_contraseña({ correo }).toPromise();
      
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
    const { correo, token, nueva_contrasena } = this.resetForm.value;
    const response = await this.usuarioService.actualizar_contraseña({ correo, token, nueva_contrasena }).toPromise();

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
