import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesMedicosPageRoutingModule } from './reportes-medicos-routing.module';

import { ReportesMedicosPage } from './reportes-medicos.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesMedicosPageRoutingModule,ComponentesModule
  ],
  declarations: [ReportesMedicosPage]
})
export class ReportesMedicosPageModule {}
