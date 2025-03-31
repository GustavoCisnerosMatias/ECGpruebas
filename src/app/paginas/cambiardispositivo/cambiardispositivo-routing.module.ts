import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiardispositivoPage } from './cambiardispositivo.page';

const routes: Routes = [
  {
    path: '',
    component: CambiardispositivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiardispositivoPageRoutingModule {}
