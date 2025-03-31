import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarcontraPage } from './editarcontra.page';

const routes: Routes = [
  {
    path: '',
    component: EditarcontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarcontraPageRoutingModule {}
