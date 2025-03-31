import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/servicios/paciente.service';

@Component({
  selector: 'app-crear-alergia',
  templateUrl: './crear-alergia.component.html',
  styleUrls: ['./crear-alergia.component.scss'],
})
export class CrearAlergiaComponent implements OnInit {
  nuevaAlergia: any = {
    Descripcion: '',
    Nivel: '',
    id_medic: '',
    id_tipo: '',
    id_usuario: '',  // Inicializamos los campos para id_usuario e id_paciente
    id_paciente: ''
  };
  usuarioActual: any;
  paciente: any;
  filtroMedicamento: string = '';
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  tiposAlergias: any[] = [];
  nivelesAlergia: string[] = ['Leve', 'Moderado', 'Grave'];
  mostrarCrearAlergia: boolean = true; // Controla si se muestra el formulario
  tipoSeleccionado: number = 0;
  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit() {
    this.cargarMedicamentos();
    this.cargarTiposAlergias();
    console.log(this.medicamentos);
    // Obtener el usuario actual y el paciente
    // Obtener el usuario actual y el paciente
  const navigation = this.router.getCurrentNavigation();
  if (navigation && navigation.extras.state) {
    this.usuarioActual = navigation.extras.state['usuario'];
    this.paciente = navigation.extras.state['paciente'];

    // Verifica si el paciente está definido
    if (this.paciente) {
      //console.log('ID Paciente:', this.paciente.id_paciente); // Depuración
      // Asignar id_usuario e id_paciente a la nueva alergia
      this.nuevaAlergia.id_usuario = this.usuarioActual.id_usuario;  // Asigna id_usuario
      this.nuevaAlergia.id_paciente = this.paciente.id_usuario;    // Asigna id_paciente
    } else {
      //console.error('El paciente está indefinido.');
    }
  } else {
    //console.error('No se pudo obtener la navegación o el estado.');
  }
  }
  onTipoAlergiaChange(tipo: number) {
    this.tipoSeleccionado = tipo; // Actualiza la variable con el tipo seleccionado
   // console.log('Tipo seleccionado:', tipo); // Para depuración
  }


  cargarMedicamentos() {
    this.pacienteService.Listarmedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data.medicamentos;
        this.medicamentosFiltrados = this.medicamentos; // Inicializa con todos los medicamentos
        console.log(data);
        console.log(this.medicamentos);
      },
      error: (err) => {
       // console.error('Error al cargar medicamentos', err);
      }
    });
  }

  cargarTiposAlergias() {
    this.pacienteService.obtenertipoalerta().subscribe({
      next: (data) => {
        this.tiposAlergias = data.tipoalergias;
      },
      error: (err) => {
        //console.error('Error al cargar tipos de alergias', err);
      }
    });
  }

  seleccionarMedicamento(medicamento: any) {
    this.nuevaAlergia.id_medic = medicamento.id_medic;
    this.filtroMedicamento = medicamento.denominacion_comun_internacional; // Mostrar el medicamento seleccionado en el campo de búsqueda
    this.medicamentosFiltrados = []; // Ocultar la lista después de seleccionar un medicamento
  }

  filtrarMedicamentos() {
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.denominacion_comun_internacional.toLowerCase().includes(this.filtroMedicamento.toLowerCase())
    );
  }

  guardarNuevaAlergia() {
    // Si no se ha seleccionado un medicamento, asigna un valor vacío a id_medic
    if (!this.nuevaAlergia.id_medic) {
        this.nuevaAlergia.id_medic = ""; // Asignar un valor vacío
    }

    console.log(this.nuevaAlergia);
    this.pacienteService.guardarAlergia(this.nuevaAlergia).subscribe({
        next: () => {
           // console.log('Alergia guardada correctamente');
            this.cerrarFormulario(); // Cerrar el formulario al guardar
        },
        error: (err) => {
            //console.error('Error al guardar la alergia', err);
        }
    });
}





  cerrarFormulario() {
    this.router.navigate(['/consultas']);// Oculta el formulario de creación de alergia
  }
}

