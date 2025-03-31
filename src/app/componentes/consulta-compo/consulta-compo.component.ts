import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ConsultasService } from 'src/app/servicios/consultas.service';
import { IonModal, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-consulta-compo',
  templateUrl: './consulta-compo.component.html',
  styleUrls: ['./consulta-compo.component.scss'],
})
export class ConsultaCompoComponent implements OnInit {
  @Input() paciente: any; 
  usuarioActual: any;
  consultaForm: FormGroup;
  medicamentoForm: FormGroup;
  medicamentos: any[] = []; 
  filteredMedicamentos: any[] = []; 
  recetas: any[] = []; 
  @ViewChild('medicamentoModal', { static: false }) medicamentoModal!: IonModal;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private pacienteService: PacienteService,
    private consultasService: ConsultasService,
    private alertController: AlertController
  ) { 
    this.consultaForm = this.fb.group({
      motivo_consulta: [''],
      observaciones: ['']
    });
    
    this.medicamentoForm = this.fb.group({
      id_medic: [null],
      fecha_vencimiento: [''],
      dosis: [''],
      frecuencia: [''],
      duracion: [''],
      instrucciones: [''],
      observaciones: [''],
      searchTerm: ['']
    });
  }
  
  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarPaciente();
    this.cargarMedicamentos();
  }

  cargarPaciente() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.paciente = navigation.extras.state["paciente"];
    }
  }

  cargarMedicamentos() {
    this.pacienteService.Listarmedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data.medicamentos;
        this.filteredMedicamentos = this.medicamentos;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos', err);
      }
    });
  }

  filterMedicamentos() {
    const term = this.medicamentoForm.get('searchTerm')?.value.toLowerCase();
    this.filteredMedicamentos = this.medicamentos.filter(medicamento =>
      medicamento.denominacion_comun_internacional.toLowerCase().includes(term) ||
      medicamento.codigo.toLowerCase().includes(term)
    );
  }

  seleccionarMedicamento(medicamento: any) {
    this.medicamentoForm.patchValue({
      id_medic: medicamento.id_medic,
      searchTerm: medicamento.denominacion_comun_internacional
    });
    this.closeMedicamentoModal();
  }

  agregarReceta() {
    const receta = {
      id_medic: this.medicamentoForm.get('id_medic')?.value,
      fecha_vencimiento: this.medicamentoForm.get('fecha_vencimiento')?.value,
      dosis: this.medicamentoForm.get('dosis')?.value,
      frecuencia: this.medicamentoForm.get('frecuencia')?.value,
      duracion: this.medicamentoForm.get('duracion')?.value,
      instrucciones: this.medicamentoForm.get('instrucciones')?.value,
      observaciones: this.medicamentoForm.get('observaciones')?.value,
      denominacion_comun_internacional: this.getMedicamentoSeleccionado()?.denominacion_comun_internacional || ''
    };
  
    this.recetas.push(receta); // Añadir receta a la lista de recetas
    this.resetMedicamentoForm(); // Limpiar el formulario después de agregar
  }
  

  eliminarReceta(index: number) {
    this.recetas.splice(index, 1);
  }

  resetMedicamentoForm() {
    this.medicamentoForm.reset();
    this.medicamentoForm.get('id_medic')?.setValue(null);
    this.medicamentoForm.get('searchTerm')?.setValue('');
  }

  async guardarConsulta() {
    const consultaData = {
      id_paciente: this.paciente.id_usuario,
      id_usuario: this.usuarioActual.id_usuario,
      motivo_consulta: this.consultaForm.value.motivo_consulta?.toUpperCase() || '',
      observaciones: this.consultaForm.value.observaciones?.toUpperCase() || '',
      recetas: this.recetas.map(receta => ({
        id_medic: receta.id_medic,
        fecha_vencimiento: receta.fecha_vencimiento,
        dosis: receta.dosis?.toUpperCase() || '',
        frecuencia: receta.frecuencia?.toUpperCase() || '',
        duracion: receta.duracion?.toUpperCase() || '',
        instrucciones: receta.instrucciones?.toUpperCase() || '',
        observaciones: receta.observaciones?.toUpperCase() || ''
      }))
    };
  
    this.consultasService.Guardarconsultas(consultaData).subscribe({
      next: async (response) => {
        //console.log('Consulta guardada con éxito');
        if (response.mensaje === "guardadas correctamente") {
          await this.presentAlert('Guardado con éxito', 'La consulta y los medicamentos se guardaron correctamente.');
        }
        this.recetas = [];
        this.resetMedicamentoForm();
      },
      error: async (err) => {
       // console.error('Error al guardar la consulta', err);
        await this.presentAlert('Error', 'No se pudo guardar la consulta. Inténtalo de nuevo.');
      }
    });
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  openMedicamentoModal() {
    this.medicamentoModal.present();
  }

  closeMedicamentoModal() {
    this.medicamentoModal.dismiss();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.usuariosService.getUsuarioActual();
  }

  getMedicamentoSeleccionado() {
    const idMedic = this.medicamentoForm.get('id_medic')?.value;
    return this.medicamentos.find(medicamento => medicamento.id_medic === idMedic);
  }

  openConsultation() {
    const url = 'https://icd.who.int/browse10/2019/en#/A15-A19';
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña.
  }
}
