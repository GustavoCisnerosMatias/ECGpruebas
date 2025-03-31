import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PacientesAsistentePage } from './pacientes-asistente.page';

const routes: Routes = [
  {
    path: '',
    component: PacientesAsistentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientesAsistentePageRoutingModule {}
