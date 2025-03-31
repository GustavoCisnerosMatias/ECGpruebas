import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/servicios/paciente.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-antece-person',
  templateUrl: './antece-person.component.html',
  styleUrls: ['./antece-person.component.scss'],
})
export class AntecePersonComponent implements OnInit {
  @Input() paciente: any;
  antecedentes: any[] = []; // Almacena los antecedentes

  constructor(private pacienteService: PacienteService, private router: Router) {}

  ngOnInit() {
    if (this.paciente) {
      this.obtenerAntecedentes(this.paciente.id_usuario); // Llama a la función para obtener antecedentes
    }
  }

  obtenerAntecedentes(id_paciente: number) {
    this.pacienteService.Obtenerantecepersonal(id_paciente).subscribe(
      (response) => {
        this.antecedentes = response; // Almacena la respuesta en la propiedad antecedentes
      },
      (error) => {
        //console.error('Error al obtener antecedentes:', error); // Maneja el error
      }
    );
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

  openConsultation() {
    const url = 'https://icd.who.int/browse10/2019/en#/A15-A19';
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña
  }

  generarPDF() {
    const element = document.getElementById('contenido-pdf'); // ID del elemento que quieres capturar
  
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190; // Ancho de la imagen (ajustado a la página A4)
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
  
        // Añadir la foto y los datos personales en dos columnas
        const fotoWidth = 40; // Ajusta el ancho de la imagen
        const fotoHeight = 40; // Ajusta la altura de la imagen
        const columnWidth = 100; // Espacio para los datos personales
  
        // Foto en la columna izquierda
        if (this.antecedentes[0]?.foto) {
          pdf.addImage(this.antecedentes[0]?.foto, 'PNG', 10, position, fotoWidth, fotoHeight); // Foto en la izquierda
        }
  
        // Datos personales en la columna derecha
        pdf.setFontSize(12); // Reducir tamaño de letra
        pdf.text(`Nombre: ${this.antecedentes[0]?.nombre} ${this.antecedentes[0]?.apellido}`, 10 + fotoWidth + 10, position); // Desplaza el texto para que esté a la derecha de la foto
        position += 10; // Espacio entre líneas
        pdf.text(`Cédula: ${this.antecedentes[0]?.cedula}`, 10 + fotoWidth + 10, position);
        position += 10;
        pdf.text(`Edad: ${this.calcularEdad(this.antecedentes[0]?.fecha_nacimiento)} años`, 10 + fotoWidth + 10, position);
        position += 10;
        pdf.text(`Género: ${this.antecedentes[0]?.Genero}`, 10 + fotoWidth + 10, position);
        position += 18;
  
        // Dibujar líneas de la tabla (cabecera)
        const startX = 15; // Posición inicial X
        const startY = position; // Posición inicial Y
        const colWidth1 = 40; // Ancho de la primera columna (Fecha Registro)
        const colWidth2 = 40; // Ancho de la segunda columna (Código Enfermedad)
        const colWidth3 = 90; // Ancho de la tercera columna (Observaciones)
        
        // Cabecera
        pdf.setFontSize(10); // Tamaño de letra para la tabla
        pdf.text('Fecha Registro', startX, startY + 5); // Ajuste de posición para que las líneas no se sobrepongan
        pdf.text('Código Enfermedad', startX + colWidth1, startY + 5);
        pdf.text('Observaciones', startX + colWidth1 + colWidth2, startY + 5);
  
        // Dibujar líneas horizontales para la cabecera
        pdf.line(startX, startY + 6, startX + colWidth1 + colWidth2 + colWidth3, startY + 6); // Línea superior de la tabla
  
        position = startY + 12; // Ajustar la posición para los datos (evitar superposición)
  
        // Dibujar líneas verticales para las columnas
        pdf.line(startX + colWidth1, startY + 5, startX + colWidth1, position + this.antecedentes.length * 9.5); // Línea columna 1
        pdf.line(startX + colWidth1 + colWidth2, startY + 5, startX + colWidth1 + colWidth2, position + this.antecedentes.length * 9.5); // Línea columna 2
  
        // Añadir los antecedentes y las líneas de la tabla
        this.antecedentes.forEach((antecedente, index) => {
          pdf.text(antecedente.fecha_consulta, startX, position);
          pdf.text(antecedente.motivo_consulta, startX + colWidth1, position);
          pdf.text(antecedente.observaciones, startX + colWidth1 + colWidth2, position);
          position += 10;
  
          // Dibujar líneas horizontales para cada fila
          pdf.line(startX, position - 5, startX + colWidth1 + colWidth2 + colWidth3, position - 5); // Línea horizontal para cada fila
        });
  
        // Guardar el PDF
        pdf.save(`Antecedentes_Paciente_${this.paciente.nombre}.pdf`);
      });
    }
  }
  
  
}
