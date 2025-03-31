import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoalertaPage } from './tipoalerta.page';

const routes: Routes = [
  {
    path: '',
    component: TipoalertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoalertaPageRoutingModule {}
