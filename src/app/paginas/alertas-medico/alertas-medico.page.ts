import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-alertas-medico',
  templateUrl: './alertas-medico.page.html',
  styleUrls: ['./alertas-medico.page.scss'],
})
export class AlertasMedicoPage implements OnInit {
  parametro: any;
  paciente: any;
  alertas: any[] = [];  // Para almacenar las alertas del paciente
  fecha_ini: string = '';  // Fecha de inicio
  fecha_fin: string = '';  // Fecha de fin
  searchTerm: string = '';  // Filtro de búsqueda por nombre_alerta

  constructor(
    private router: Router, 
    private alertasService: AlertasService
  ) {}

  ngOnInit() {
    this.obtenerDatos();
  }

  obtenerDatos() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { parametro: any, paciente: any };
      if (state) {
        this.parametro = state.parametro;
        this.paciente = state.paciente;

        // Cargar alertas para el paciente con las fechas seleccionadas
        this.cargarAlertasPaciente(this.paciente.id_usuario);
      } else {
        console.error('No se recibieron datos del parámetro o paciente');
      }
    }
  }

  cargarAlertasPaciente(id_usuario: number) {
    this.alertasService.obtenerAlertasfecha(id_usuario, this.fecha_ini, this.fecha_fin).subscribe(response => {
      this.alertas = response.Alertas.sort((a, b) => {
        const dateA = new Date(a.fecha_alerta).getTime();
        const dateB = new Date(b.fecha_alerta).getTime();
        return dateB - dateA;  // Ordenar en orden descendente
      });
    }, error => {
      console.error('Error al cargar alertas', error);
    });
  }

  // Filtro de búsqueda por nombre_alerta
  filterAlertas() {
    if (this.searchTerm.trim() !== '') {
      return this.alertas.filter(alerta => alerta.nombre_alerta.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    return this.alertas;
  }

  // Método que se ejecuta cuando las fechas cambian
  onFechaChange() {
    this.cargarAlertasPaciente(this.paciente.id_usuario);
  }

  imprimir() {
    const contenido = document.getElementById('contenido-a-imprimir'); 
    const ventana = window.open('', 'Alertas');
    
    // Generar una tabla con los datos del paciente y las alertas
    let contenidoHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td colspan="2" style="text-align: center; font-size: 20px; font-weight: bold;">Datos del paciente</td>
        </tr>
        <tr>
          <td><strong>Nombre:</strong> ${this.paciente?.apellido}</td>
          <td><strong>Apellido:</strong> ${this.paciente?.cedula}</td>
        </tr>
        <tr>
          <td><strong>Cédula:</strong> ${this.paciente?.nombre}</td>
          <td><strong>Teléfono:</strong> ${this.paciente?.telefono}</td>
        </tr>
      </table>
    `;
  
    // Añadir las fechas seleccionadas
    contenidoHTML += `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td><strong>Fecha de inicio:</strong> ${this.fecha_ini}</td>
          <td><strong>Fecha de fin:</strong> ${this.fecha_fin}</td>
        </tr>
      </table>
    `;
  
    // Agregar las alertas en formato tabla
    contenidoHTML += `
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <tr style="background-color: #f2f2f2;">
          <th>Nombre de Alerta</th>
          <th>Fecha</th>
          <th>Valor</th>
        </tr>
    `;
    
    this.filterAlertas().forEach(alerta => {
      contenidoHTML += `
        <tr>
          <td>${alerta.nombre_alerta}</td>
          <td>${alerta.fecha_alerta}</td>
          <td>${alerta.valor} ${alerta.unidad_medida}</td>
        </tr>
      `;
    });
    
    contenidoHTML += `</table>`;
    
    // Escribir el contenido HTML generado en la nueva ventana
    ventana?.document.write(contenidoHTML);
    ventana?.document.close();
    ventana?.print(); // Abre la ventana de impresión
  }
  
}
