import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarMedicoPage } from './agregar-medico.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarMedicoPageRoutingModule {}
