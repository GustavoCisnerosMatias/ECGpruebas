import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoalertaPageRoutingModule } from './tipoalerta-routing.module';

import { TipoalertaPage } from './tipoalerta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoalertaPageRoutingModule
  ],
  declarations: [TipoalertaPage]
})
export class TipoalertaPageModule {}
