import { Component, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { alertas } from 'src/app/interfaces/interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-todasalertas',
  templateUrl: './todasalertas.page.html',
  styleUrls: ['./todasalertas.page.scss'],
})
export class TodasalertasPage implements OnInit {
  alertas: alertas[] = [];
  filteredAlertas: alertas[] = [];
  searchName: string = '';
  startDate: string = '';
  endDate: string = '';
  usuarioActual: any | null = null;

  constructor(private usuariosService: UsuariosService, private alertasService: AlertasService) { }

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  async cargarUsuarioActual() {
    this.usuarioActual = await this.usuariosService.getUsuarioActual(); // Si es una promesa o async
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      this.cargarAlertas(); // Llama a cargarAlertas solo si usuarioActual se cargó
    } else {
      console.error('No se pudo cargar el usuario actual');
    }
  }

  cargarAlertas() {
    if (this.usuarioActual && this.usuarioActual.id_usuario) {
      // Verifica que las fechas sean válidas y las envía al servicio
      if (this.startDate && this.endDate) {
        this.alertasService.obtenerAlertasfecha(this.usuarioActual.id_usuario, this.startDate, this.endDate)
          .subscribe((response) => {
            this.alertas = response.Alertas;
            this.filterAlertas(); // Aplica el filtro de nombre si existe
          });
      } else {
        // Si no hay fechas, envía vacías o cualquier otro valor por defecto
        this.alertasService.obtenerAlertasfecha(this.usuarioActual.id_usuario, '', '')
          .subscribe((response) => {
            this.alertas = response.Alertas;
            this.filterAlertas(); // Aplica el filtro de nombre si existe
          });
      }
    }
  }

  // Filtra las alertas por nombre, si hay un valor en searchName
  filterAlertas() {
    let filtered = this.alertas;

    // Filtro por nombre
    if (this.searchName) {
      filtered = filtered.filter(alerta =>
        alerta.nombre_alerta.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }

    this.filteredAlertas = filtered;
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES'); // Ejemplo para formato de fecha en español
  }
  imprimir() {
    const contenido = document.getElementById('contenido-a-imprimir');  // Obtener el contenido del DOM
  
    // Si el contenido es nulo, no hacemos nada
    if (!contenido) return;
  
    const ventana = window.open('', 'Alertas');
  
    // Agregar una hoja de estilos para mejorar la apariencia al imprimir
    ventana?.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #fff;
              line-height: 1.6;
            }
            h1 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
            }
            /* Estilos para la tabla */
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .table th, .table td {
              padding: 10px;
              text-align: left;
              border: 1px solid #ccc;
              vertical-align: middle; /* Asegura que el contenido esté alineado correctamente */
            }
            .table th {
              background-color: #f7f7f7;
              font-weight: bold;
            }
            .highlight-new {
              background-color: #ffeb3b;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Alertas</h1>
          <div class="content-container">
            <!-- Insertamos la tabla generada dinámicamente -->
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre Alerta</th>
                  <th>Fecha Alerta</th>
                  <th>Valor</th>
                  <th>Unidad</th>
                  <th>Vista</th>
                </tr>
              </thead>
              <tbody>
                ${this.generarFilasDeTabla()}  <!-- Llamamos a la función que genera las filas de la tabla -->
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `);
  
    ventana?.document.close();
    ventana?.print(); // Abre la ventana de impresión
  }
  
  generarFilasDeTabla() {
    // Genera el contenido de las filas de la tabla
    return this.filteredAlertas.map(alerta => {
      return `
        <tr class="${alerta.vista === 'Nuevo' ? 'highlight-new' : ''}">
          <td>${alerta.nombre_alerta}</td>
          <td>${this.formatFecha(alerta.fecha_alerta)}</td>
          <td>${alerta.valor}</td>
          <td>${alerta.unidad_medida}</td>
          <td>${alerta.vista}</td>
        </tr>
      `;
    }).join('');
  }
  
  
}
