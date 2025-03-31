import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiardispositivoPageRoutingModule } from './cambiardispositivo-routing.module';

import { CambiardispositivoPage } from './cambiardispositivo.page';
import { DispositivoComponent } from 'src/app/componentes/dispositivo/dispositivo.component';
import { ComponentesComponent } from 'src/app/componentes/componentes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiardispositivoPageRoutingModule
  ],
  declarations: [CambiardispositivoPage, ComponentesComponent]
})
export class CambiardispositivoPageModule {}
