import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarUsernamePage } from './recuperar-username.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarUsernamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarUsernamePageRoutingModule {}
