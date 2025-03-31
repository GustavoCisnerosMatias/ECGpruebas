import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorariosMedicoPage } from './horarios-medico.page';

const routes: Routes = [
  {
    path: '',
    component: HorariosMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorariosMedicoPageRoutingModule {}
