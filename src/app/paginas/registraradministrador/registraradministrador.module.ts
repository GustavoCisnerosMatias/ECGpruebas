import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistraradministradorPageRoutingModule } from './registraradministrador-routing.module';

import { RegistraradministradorPage } from './registraradministrador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistraradministradorPageRoutingModule
  ],
  declarations: [RegistraradministradorPage]
})
export class RegistraradministradorPageModule {}
