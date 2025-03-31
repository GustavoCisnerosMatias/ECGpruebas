import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParametrosPageRoutingModule } from './parametros-routing.module';

import { ParametrosPage } from './parametros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParametrosPageRoutingModule
  ],
  declarations: [ParametrosPage]
})
export class ParametrosPageModule {}
