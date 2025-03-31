import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialMediPaciPage } from './historial-medi-paci.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialMediPaciPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialMediPaciPageRoutingModule {}
