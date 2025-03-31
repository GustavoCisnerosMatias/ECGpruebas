import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosmedicoPage } from './datosmedico.page';

const routes: Routes = [
  {
    path: '',
    component: DatosmedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosmedicoPageRoutingModule {}
