import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarUserPageRoutingModule } from './cambiar-user-routing.module';

import { CambiarUserPage } from './cambiar-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarUserPageRoutingModule
  ],
  declarations: [CambiarUserPage]
})
export class CambiarUserPageModule {}
