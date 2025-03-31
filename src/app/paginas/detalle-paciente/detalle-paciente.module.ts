import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePacientePageRoutingModule } from './detalle-paciente-routing.module';

import { DetallePacientePage } from './detalle-paciente.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePacientePageRoutingModule,
    ComponentesModule,
  ],
  declarations: [DetallePacientePage]
})
export class DetallePacientePageModule {}
