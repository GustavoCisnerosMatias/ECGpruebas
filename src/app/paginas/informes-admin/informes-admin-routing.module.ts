import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesAdminPage } from './informes-admin.page';

const routes: Routes = [
  {
    path: '',
    component: InformesAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesAdminPageRoutingModule {}
