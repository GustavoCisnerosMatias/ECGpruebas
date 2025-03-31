/* // src/app/componentes/grafica-tiempo-real/grafica-tiempo-real.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-grafica-tiempo-real',
  templateUrl: './grafica-tiempo-real.component.html',
  styleUrls: ['./grafica-tiempo-real.component.scss'],
})
export class GraficaTiempoRealComponent implements OnChanges {
  @Input() datos: any;
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public lineChartType: ChartType = 'line';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datos'] && this.datos) {
      this.actualizarGrafica();
    }
  }

  actualizarGrafica() {
    this.lineChartData.datasets = [
      {
        data: this.datos.map((d: any) => d.valor),
        label: 'Valor',
      },
    ];
    this.lineChartData.labels = this.datos.map((d: any) => d.fecha);
  }
}
 */