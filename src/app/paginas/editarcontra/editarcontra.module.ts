import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarcontraPageRoutingModule } from './editarcontra-routing.module';

import { EditarcontraPage } from './editarcontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarcontraPageRoutingModule
  ],
  declarations: [EditarcontraPage]
})
export class EditarcontraPageModule {}
