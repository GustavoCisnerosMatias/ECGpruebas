import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarUserPage } from './cambiar-user.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarUserPageRoutingModule {}
