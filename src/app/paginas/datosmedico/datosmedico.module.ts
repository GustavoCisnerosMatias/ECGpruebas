import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosmedicoPageRoutingModule } from './datosmedico-routing.module';

import { DatosmedicoPage } from './datosmedico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosmedicoPageRoutingModule
  ],
  declarations: [DatosmedicoPage]
})
export class DatosmedicoPageModule {}
