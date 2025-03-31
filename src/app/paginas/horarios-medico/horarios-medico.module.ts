import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosMedicoPageRoutingModule } from './horarios-medico-routing.module';

import { HorariosMedicoPage } from './horarios-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorariosMedicoPageRoutingModule
  ],
  declarations: [HorariosMedicoPage]
})
export class HorariosMedicoPageModule {}
