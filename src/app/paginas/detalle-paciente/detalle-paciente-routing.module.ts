import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePacientePage } from './detalle-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePacientePageRoutingModule {}
