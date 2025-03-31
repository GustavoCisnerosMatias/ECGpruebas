import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VizualizarParametrosPage } from './vizualizar-parametros.page';

const routes: Routes = [
  {
    path: '',
    component: VizualizarParametrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VizualizarParametrosPageRoutingModule {}
