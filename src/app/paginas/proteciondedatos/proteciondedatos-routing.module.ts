import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProteciondedatosPage } from './proteciondedatos.page';

const routes: Routes = [
  {
    path: '',
    component: ProteciondedatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProteciondedatosPageRoutingModule {}
