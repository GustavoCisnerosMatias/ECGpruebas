import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutentificacionPageRoutingModule } from './autentificacion-routing.module';

import { AutentificacionPage } from './autentificacion.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutentificacionPageRoutingModule
  ],
  declarations: [AutentificacionPage]
})
export class AutentificacionPageModule {}
