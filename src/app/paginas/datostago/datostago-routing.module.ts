import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatostagoPage } from './datostago.page';

const routes: Routes = [
  {
    path: '',
    component: DatostagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatostagoPageRoutingModule {}
