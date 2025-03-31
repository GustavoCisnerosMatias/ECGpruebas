import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditartodousuarioPageRoutingModule } from './editartodousuario-routing.module';

import { EditartodousuarioPage } from './editartodousuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditartodousuarioPageRoutingModule
  ],
  declarations: [EditartodousuarioPage]
})
export class EditartodousuarioPageModule {}
