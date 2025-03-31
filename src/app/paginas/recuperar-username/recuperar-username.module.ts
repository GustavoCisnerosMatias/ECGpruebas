import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarUsernamePageRoutingModule } from './recuperar-username-routing.module';

import { RecuperarUsernamePage } from './recuperar-username.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarUsernamePageRoutingModule,ReactiveFormsModule
  ],
  declarations: [RecuperarUsernamePage]
})
export class RecuperarUsernamePageModule {}
