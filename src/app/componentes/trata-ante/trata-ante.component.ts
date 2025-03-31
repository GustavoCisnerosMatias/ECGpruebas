import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PacienteService } from 'src/app/servicios/paciente.service';
import { ConsultasService } from 'src/app/servicios/consultas.service';
import { Receta } from 'src/app/interfaces/interface';
import { jsPDF } from 'jspdf';  // Importamos jsPDF

@Component({
  selector: 'app-trata-ante',
  templateUrl: './trata-ante.component.html',
  styleUrls: ['./trata-ante.component.scss'],
})
export class TrataAnteComponent implements OnInit {
  @Input() paciente: any; 
  usuarioActual: any;
  recetas: Receta[] = []; // Ahora se usa la interfaz Receta
  anioSeleccionado: number = 0; // Añadido para el año seleccionado
  anios: number[] = []; // Lista de años disponibles

  constructor(
    private pacienteService: PacienteService,
    private consultasService: ConsultasService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.usuarioActual = navigation.extras.state['usuario'];
      this.paciente = navigation.extras.state['paciente'];
    }

    // Generar una lista de años (por ejemplo, de 2020 a 2030)
    const currentYear = new Date().getFullYear();
    this.anios = Array.from({ length: 11 }, (_, i) => currentYear - i);

    // Obtener las recetas del paciente usando id_usuario
    if (this.paciente && this.paciente.id_usuario) {
      //console.log(this.paciente.id_usuario);
      this.filtrarRecetas(); // Llamar a filtrarRecetas al inicio
    }
  }

  filtrarRecetas() {
    if (this.paciente && this.paciente.id_usuario && this.anioSeleccionado) {
      this.consultasService.listarreceta(this.paciente.id_usuario, this.anioSeleccionado).subscribe(
        (response) => {
          this.recetas = response.recetas.sort((a: Receta, b: Receta) => {
            return new Date(b.fecha_receta).getTime() - new Date(a.fecha_receta).getTime();
          });
        },
        (error) => {
          console.error('Error al obtener recetas:', error);
          this.mostrarToast('Error al obtener recetas');
        }
      );
    }
  }
  calcularEdad(fecha_nacimiento: string | undefined): number {
    if (!fecha_nacimiento) {
      return 0;  // o cualquier valor predeterminado que desees
    }
  
    const nacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
  
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
  
  openConsultation() {
    const url = 'https://icd.who.int/browse10/2019/en#/A15-A19';
    window.open(url, '_blank');
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }

 

  generarPDF() {
    const doc = new jsPDF();
  
    // Establecer un tamaño de fuente pequeño (por ejemplo, 8)
    doc.setFontSize(10);
  
    // Información del paciente
    if (this.recetas.length > 0) {
      const paciente = this.recetas[0]; // Se asume que todas las recetas pertenecen al mismo paciente
      doc.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 10, 10);
      doc.text(`Cédula: ${paciente.cedula}`, 10, 20);
      doc.text(`Edad: ${this.calcularEdad(paciente.fecha_nacimiento)} años`, 10, 30);
      doc.text(`Género: ${paciente.Genero}`, 10, 40);
      
      // Añadir espacio entre los datos del paciente y las recetas
      doc.text(' ', 10, 50);
    }
  
    // Recetas
    let y = 60; // Empezamos a escribir las recetas después de los datos del paciente
    this.recetas.forEach((receta, index) => {
      // Espacio adicional entre grupos de recetas
      if (index > 0) {
        y += 20; // Espacio extra entre recetas
      }
  
      doc.text(`Código: ${receta.codigo}`, 10, y);
      doc.text(`Fecha Receta: ${receta.fecha_receta}`, 10, y + 10);
      doc.text(`Fármaco: ${receta.denominacion_comun_internacional} (${receta.forma_farmaceutica})`, 10, y + 20);
      doc.text(`Diagnóstico: ${receta.motivo_consulta}`, 10, y + 30);
      doc.text(`Dosis: ${receta.dosis}`, 10, y + 40);
      doc.text(`Frecuencia: ${receta.frecuencia}`, 10, y + 50);
      doc.text(`Duración: ${receta.duracion}`, 10, y + 60);
      doc.text(`Instrucciones: ${receta.instrucciones}`, 10, y + 70);
      doc.text(`Observaciones: ${receta.observaciones || 'N/A'}`, 10, y + 80);
      doc.text(`Vencimiento: ${receta.fecha_vencimiento}`, 10, y + 90);
  
      // Aumentar la posición 'y' para la siguiente receta
      y += 100; // Ajustar el espacio entre las recetas según sea necesario
    });
  
    // Guardar el PDF
    doc.save('recetas_medicas.pdf');
  }
   
}
