import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertasMedicoPageRoutingModule } from './alertas-medico-routing.module';

import { AlertasMedicoPage } from './alertas-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertasMedicoPageRoutingModule
  ],
  declarations: [AlertasMedicoPage]
})
export class AlertasMedicoPageModule {}
