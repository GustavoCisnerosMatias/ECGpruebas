import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TelemedicinaPageRoutingModule } from './telemedicina-routing.module';

import { TelemedicinaPage } from './telemedicina.page';
import { ChatUsuarioComponent } from 'src/app/componentes/chat-usuario/chat-usuario.component';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelemedicinaPageRoutingModule,
    ComponentesModule,
  ],
  declarations: [TelemedicinaPage]
})
export class TelemedicinaPageModule {}
