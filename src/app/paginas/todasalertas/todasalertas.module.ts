import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodasalertasPageRoutingModule } from './todasalertas-routing.module';

import { TodasalertasPage } from './todasalertas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodasalertasPageRoutingModule
  ],
  declarations: [TodasalertasPage]
})
export class TodasalertasPageModule {}
