import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VizualizarParametrosPageRoutingModule } from './vizualizar-parametros-routing.module';

import { VizualizarParametrosPage } from './vizualizar-parametros.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VizualizarParametrosPageRoutingModule,ComponentesModule
  ],
  declarations: [VizualizarParametrosPage]
})
export class VizualizarParametrosPageModule {}
