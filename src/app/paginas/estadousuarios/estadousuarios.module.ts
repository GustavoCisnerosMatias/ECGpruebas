import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadousuariosPageRoutingModule } from './estadousuarios-routing.module';

import { EstadousuariosPage } from './estadousuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadousuariosPageRoutingModule
  ],
  declarations: [EstadousuariosPage]
})
export class EstadousuariosPageModule {}
