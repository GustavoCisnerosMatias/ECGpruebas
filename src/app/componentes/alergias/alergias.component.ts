import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.component.html',
  styleUrls: ['./alergias.component.scss'],
})
export class AlergiasComponent implements OnInit {
  @Input() paciente: any; 
  usuarioActual: any;
  alergias: any[] = []; 
  //medicamentos: any[] = [];
  medicamentos: any[] = [];
  alimentos: any[] = [];
  otros: any[] = [];

  tiposAlergias: any[] = [];
  alergiaSeleccionada: any = null;
  //filtroMedicamento: string = '';
  //medicamentoSeleccionado: string = '';
  nivelesAlergia: string[] = ['Leve', 'Moderado', 'Grave']; // Niveles de gravedad de alergia

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteService: PacienteService
  ) { }

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarTiposAlergias();
    //this.cargarMedicamentos();
    this.cargarPacienteDesdeNavegacion();
    this.cargarAlergias(); // Carga las alergias si el paciente está disponible
  }

  cargarPacienteDesdeNavegacion() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.paciente = navigation.extras.state["paciente"]; // Asigna el paciente del estado de navegación
    }

  }

  cargarAlergias() {
    if (this.paciente) {
      this.pacienteService.Obteneralergiasxid(this.paciente.id_usuario).subscribe({
        next: (data) => {
          this.alergias = data.Alergias;
  
          // Clasificar las alergias
          this.medicamentos = this.alergias.filter(alergia => alergia.NombreTipo === 'Medicamento');
          this.alimentos = this.alergias.filter(alergia => alergia.NombreTipo === 'Alimento');
          this.otros = this.alergias.filter(
            alergia =>
              alergia.NombreTipo !== 'Medicamento' &&
              alergia.NombreTipo !== 'Alimento'
          );
        },
        error: (err) => {
          console.error('Error al obtener alergias', err);
        }
      });
    }
  }
  
  refreshPage(){
    this.cargarAlergias();
 }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }



  cargarTiposAlergias() {
    this.pacienteService.obtenertipoalerta().subscribe({
      next: (data) => {
        this.tiposAlergias = data.tipoalergias;
      },
      error: (err) => {
       // console.error('Error al cargar tipos de alergias', err);
      }
    });
  }

  seleccionarAlergia(alergia: any) {
    this.alergiaSeleccionada = { ...alergia };
  }

  actualizarAlergia() {
    // Convierte los campos deseados a mayúsculas antes de enviar la solicitud
    this.alergiaSeleccionada.Descripcion = this.alergiaSeleccionada.Descripcion.toUpperCase();
    this.alergiaSeleccionada.Nivel = this.alergiaSeleccionada.Nivel.toUpperCase(); // Si deseas también convertir el nivel a mayúsculas
  
    this.pacienteService.actualizaralergias(this.alergiaSeleccionada).subscribe({
      next: () => {
        //console.log('Alergia actualizada correctamente');
       // console.log(this.alergiaSeleccionada);
        this.alergiaSeleccionada = null; // Limpiar el formulario
        this.cargarAlergias(); // Llama al método para recargar las alergias
      },
      error: (err) => {
        //console.error('Error al actualizar la alergia', err);
      }
    });
  }
  



  irACrearAlerta() {
    if (!this.usuarioActual || !this.paciente) {
     // console.error('Usuario actual o paciente no definidos.');
      return; // Salir de la función si alguno de los datos es indefinido
    }

    this.router.navigate(['/crear-alergia'], {
      state: {
        usuario: this.usuarioActual, // Enviar el objeto completo
        paciente: this.paciente // Enviar el objeto completo
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

  eliminarAlergia(id_alergia: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta alergia?')) {
      this.pacienteService.eliminaralergia(id_alergia).subscribe({
        next: () => {
          //console.log('Alergia eliminada correctamente');
          this.cargarAlergias(); // Recargar la lista de alergias después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar la alergia', err);
        }
      });
    }
  }
 }
