import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PacientesAsistentePageRoutingModule } from './pacientes-asistente-routing.module';

import { PacientesAsistentePage } from './pacientes-asistente.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PacientesAsistentePageRoutingModule,ComponentesModule
  ],
  declarations: [PacientesAsistentePage]
})
export class PacientesAsistentePageModule {}
