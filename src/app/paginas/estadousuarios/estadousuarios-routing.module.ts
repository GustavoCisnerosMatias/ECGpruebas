import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadousuariosPage } from './estadousuarios.page';

const routes: Routes = [
  {
    path: '',
    component: EstadousuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadousuariosPageRoutingModule {}
