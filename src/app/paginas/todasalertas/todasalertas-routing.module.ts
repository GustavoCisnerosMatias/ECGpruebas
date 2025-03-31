import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodasalertasPage } from './todasalertas.page';

const routes: Routes = [
  {
    path: '',
    component: TodasalertasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodasalertasPageRoutingModule {}
