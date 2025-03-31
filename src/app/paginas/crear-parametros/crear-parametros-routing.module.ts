import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearParametrosPage } from './crear-parametros.page';

const routes: Routes = [
  {
    path: '',
    component: CrearParametrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearParametrosPageRoutingModule {}
