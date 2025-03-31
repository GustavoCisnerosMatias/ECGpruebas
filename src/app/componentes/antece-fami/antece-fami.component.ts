
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-antece-fami',
  templateUrl: './antece-fami.component.html',
  styleUrls: ['./antece-fami.component.scss'],
})
export class AnteceFamiComponent implements OnInit {
  antecedentes: any[] = []; // Almacena los antecedentes familiares
  anteFamiForm: FormGroup; // Formulario para la edición
  @Input() paciente: any; 
  usuarioActual: any;
  idAntecedenteSeleccionado: number | null = null; // Variable para almacenar el id del antecedente seleccionado

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private location: Location
  ) { 
    this.anteFamiForm = this.fb.group({
      relacion_familiar: [''],
      Codigo_emfermedad: [''],
      edad_diagnostico: [''],
      estado_actual: [''],
      causa_muerte: [''],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.cargarUsuarioActual();

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.paciente = navigation.extras.state["paciente"]; // Asigna el paciente del estado de navegación
      this.cargarantefami();
    }
    this.cargarantefami();
    
  }

  cargarantefami() {
    // Obtener antecedentes familiares del servicio
    if (!this.paciente) {
      //console.warn('No se ha definido un paciente');
      return; // Salir si no hay paciente
    }
  
    this.pacienteService.Obtenerantecefamixid(this.paciente.id_usuario).subscribe({
      next: (data) => {
        // Verificar si hay antecedentes en los datos recibidos
        if (data && data.ante_flia && Array.isArray(data.ante_flia)) {
          this.antecedentes = data.ante_flia; // Asigna los antecedentes recibidos
  
          // Verificar si hay antecedentes y asignar el primero
          if (this.antecedentes.length > 0) {
            this.idAntecedenteSeleccionado = this.antecedentes[0].id_antecedente; // Guardar el id_antecedente
            this.llenarFormulario(this.antecedentes[0]); // Llena el formulario con el primer antecedente recibido
          } else {
            //console.warn('No se encontraron antecedentes familiares');
          }
        } else {
          //console.error('Datos de antecedentes familiares no válidos', data);
        }
      },
      error: (err) => {
        //console.error('Error al obtener antecedentes', err);
      }
    });
  }
  
  refreshPage(){
     this.cargarantefami();
  }
  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  // Función que carga los datos del antecedente en el formulario
  llenarFormulario(antecedente: any) {
    this.idAntecedenteSeleccionado = antecedente.id_antecedente; // Guardar el id del antecedente seleccionado
    this.anteFamiForm.patchValue({
      relacion_familiar: antecedente.relacion_familiar || '',
      Codigo_emfermedad: antecedente.Codigo_emfermedad || '',
      edad_diagnostico: antecedente.edad_diagnostico || '',
      estado_actual: antecedente.estado_actual || '',
      causa_muerte: antecedente.causa_muerte || '',
      observaciones: antecedente.observaciones || ''
    });
  }

  toggleEdit(antecedente: any) {
    if (antecedente.editando) {
      // Si está en modo de edición, actualizar los antecedentes
      this.editarAntecedenteFamiliar(antecedente);
    } else {
      // Si no está en modo de edición, habilitar la edición
      antecedente.editando = true;
      this.idAntecedenteSeleccionado = antecedente.id_antecedente; // Actualiza el id del antecedente seleccionado
    }
  }

  editarAntecedenteFamiliar(antecedente: any) {
    if (this.idAntecedenteSeleccionado) {
      const datosActualizados = {
        id_antecedente: this.idAntecedenteSeleccionado,
        relacion_familiar: antecedente.relacion_familiar,
        Codigo_emfermedad: antecedente.Codigo_emfermedad,
        edad_diagnostico: antecedente.edad_diagnostico,
        estado_actual: antecedente.estado_actual,
        causa_muerte: antecedente.causa_muerte,
        observaciones: antecedente.observaciones
      };

      this.pacienteService.actualizarAntecedenteFamiliar(datosActualizados).subscribe({
        next: (response) => {
          //console.log('Antecedente familiar actualizado:', response);
          antecedente.editando = false; // Desactivar el modo de edición
        },
        error: (error) => {
          //console.error('Error al actualizar el antecedente familiar:', error);
        }
      });
    }
  }
  openConsultation() {
    const url = 'https://icd.who.int/browse10/2019/en#/A15-A19';
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña.
  }

  irACrearAntecedente() {
    if (!this.usuarioActual || !this.paciente) {
     // console.error('Usuario actual o paciente no definidos.');
      return; // Salir de la función si alguno de los datos es indefinido
    }

    this.router.navigate(['/crear-ante-flia'], {
      state: {
        usuario: this.usuarioActual.id_usuario,
        paciente: this.paciente.id_usuario
      }
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
