import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatostagoPageRoutingModule } from './datostago-routing.module';

import { DatostagoPage } from './datostago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatostagoPageRoutingModule
  ],
  declarations: [DatostagoPage]
})
export class DatostagoPageModule {}
