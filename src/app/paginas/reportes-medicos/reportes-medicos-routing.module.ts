import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesMedicosPage } from './reportes-medicos.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesMedicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesMedicosPageRoutingModule {}
