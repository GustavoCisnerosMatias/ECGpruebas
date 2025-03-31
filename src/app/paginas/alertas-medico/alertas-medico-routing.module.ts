import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertasMedicoPage } from './alertas-medico.page';

const routes: Routes = [
  {
    path: '',
    component: AlertasMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertasMedicoPageRoutingModule {}
