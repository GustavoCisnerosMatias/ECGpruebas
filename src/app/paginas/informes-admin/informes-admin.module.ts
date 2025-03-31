import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformesAdminPageRoutingModule } from './informes-admin-routing.module';

import { InformesAdminPage } from './informes-admin.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesAdminPageRoutingModule,ComponentesModule
  ],
  declarations: [InformesAdminPage]
})
export class InformesAdminPageModule {}
