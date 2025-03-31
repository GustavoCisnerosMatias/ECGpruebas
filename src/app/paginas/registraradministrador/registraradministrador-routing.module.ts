import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistraradministradorPage } from './registraradministrador.page';

const routes: Routes = [
  {
    path: '',
    component: RegistraradministradorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistraradministradorPageRoutingModule {}
