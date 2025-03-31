import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearmedicosPageRoutingModule } from './crearmedicos-routing.module';

import { CrearmedicosPage } from './crearmedicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearmedicosPageRoutingModule
  ],
  declarations: [CrearmedicosPage]
})
export class CrearmedicosPageModule {}
