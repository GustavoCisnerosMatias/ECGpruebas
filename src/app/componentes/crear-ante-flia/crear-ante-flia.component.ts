import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PacienteService } from 'src/app/servicios/paciente.service';

@Component({
  selector: 'app-crear-ante-flia',
  templateUrl: './crear-ante-flia.component.html',
  styleUrls: ['./crear-ante-flia.component.scss']
})
export class CrearAnteFliaComponent implements OnInit {

  anteFamiForm: FormGroup = new FormGroup({});
 // Asegúrate de que esta propiedad esté definida
  usuarioActual: any;
  paciente: any;
// CrearAnteFliaComponent.ts
relacionesFamiliares: string[] = [
  'Papà',
  'Madre',
  'Hermano',
  'Hermana',
  'Hijo',
  'Hija',
  'Abuelo',
  'Abuela',
  'Tío',
  'Tía',
  'Primo',
  'Prima'
];

  constructor(
    private formBuilder: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Inicializar el formulario
    this.anteFamiForm = this.formBuilder.group({
      relacion_familiar: ['', Validators.required],
      Codigo_emfermedad: ['', Validators.required],
      edad_diagnostico: ['', Validators.required],
      estado_actual: ['', Validators.required],
      causa_muerte: [''], // Permitimos que este campo sea nulo
      observaciones: [''] // Permitimos que este campo sea nulo
    });

    // Obtener el usuario actual y el paciente
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.usuarioActual = navigation.extras.state['usuario'];
      this.paciente = navigation.extras.state['paciente'];
    }
  }

  // Función para guardar el nuevo antecedente familiar
  guardarAntecedenteFamiliar() {
    if (this.anteFamiForm.valid) {
        const nuevoAntecedente = {
            id_usuario: this.usuarioActual || 0, // Asegúrate de que este valor se esté pasando correctamente
            id_paciente: this.paciente || 0, // Asegúrate de que este valor se esté pasando correctamente
            ...this.anteFamiForm.value
        };

        // Verifica el objeto antes de enviarlo
       // console.log('Datos a guardar:', nuevoAntecedente);

        // Ajusta los campos según lo que espera tu API
        nuevoAntecedente.estado_actual = nuevoAntecedente.estado_actual || ""; // Asegúrate de que tenga un valor
        nuevoAntecedente.causa_muerte = nuevoAntecedente.causa_muerte || ""; // Asegúrate de que tenga un valor
        nuevoAntecedente.observaciones = nuevoAntecedente.observaciones || ""; // Asegúrate de que tenga un valor

        this.pacienteService.guardarAntecedenteFamiliar(nuevoAntecedente).subscribe({
            next: (response) => {
                if (response.mensaje) {
                    this.mostrarMensaje(response.mensaje);
                }
                this.cerrar();
            },
            error: (err) => {
                console.error('Error al guardar antecedente familiar', err);
            }
        });
    } else {
        //console.error('Formulario inválido', this.anteFamiForm.errors); // Log para errores del formulario
    }
}

  
  cerrar() {
    // Redirigir a /consultas
    this.router.navigate(['/consultas']);
  }
  openConsultation() {
    // Redirigir al usuario al enlace de consulta de enfermedades.
    const url = 'https://icd.who.int/browse10/2019/en#/A15-A19';
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña.
  }
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top', // Puedes cambiar la posición si lo deseas
      color: 'success' // Cambiar el color del toast si lo deseas
    });
    await toast.present();
  }
}
