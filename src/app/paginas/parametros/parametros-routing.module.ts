import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametrosPage } from './parametros.page';

const routes: Routes = [
  {
    path: '',
    component: ParametrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosPageRoutingModule {}
