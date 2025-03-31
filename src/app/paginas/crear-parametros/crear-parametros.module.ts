import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearParametrosPageRoutingModule } from './crear-parametros-routing.module';

import { CrearParametrosPage } from './crear-parametros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearParametrosPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [CrearParametrosPage]
})
export class CrearParametrosPageModule {}
