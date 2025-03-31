import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatostiemporealPage } from './datostiemporeal.page';

const routes: Routes = [
  {
    path: '',
    component: DatostiemporealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatostiemporealPageRoutingModule {}
