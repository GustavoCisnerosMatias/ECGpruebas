import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarMedicoPageRoutingModule } from './agregar-medico-routing.module';

import { AgregarMedicoPage } from './agregar-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarMedicoPageRoutingModule
  ],
  declarations: [AgregarMedicoPage]
})
export class AgregarMedicoPageModule {}
