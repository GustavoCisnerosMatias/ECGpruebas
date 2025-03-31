import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialMediPaciPageRoutingModule } from './historial-medi-paci-routing.module';

import { HistorialMediPaciPage } from './historial-medi-paci.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialMediPaciPageRoutingModule,
    ComponentesModule
  ],
  declarations: [HistorialMediPaciPage]
})
export class HistorialMediPaciPageModule {}
