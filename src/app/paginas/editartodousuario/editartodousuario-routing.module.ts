import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditartodousuarioPage } from './editartodousuario.page';

const routes: Routes = [
  {
    path: '',
    component: EditartodousuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditartodousuarioPageRoutingModule {}
