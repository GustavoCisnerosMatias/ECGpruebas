import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearUsuariosPageRoutingModule } from './crear-usuarios-routing.module';
import { CrearUsuariosPage } from './crear-usuarios.page';
import { CrearUsuarioComponent } from '../../componentes/crear-usuario/crear-usuario.component';
import { DatosFisicosComponent } from '../../componentes/datos-fisicos/datos-fisicos.component';
import { DispositivoComponent } from '../../componentes/dispositivo/dispositivo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearUsuariosPageRoutingModule
  ],
  declarations: [
    CrearUsuariosPage,
    CrearUsuarioComponent,
    DatosFisicosComponent,
    DispositivoComponent,
  ],
 // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrearUsuariosPageModule {}
