import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasComponent } from './alertas/alertas.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { VizualizarParametroComponent } from './vizualizar-parametro/vizualizar-parametro.component';
import { ChatUsuarioComponent } from './chat-usuario/chat-usuario.component';
import { AnteceFamiComponent } from './antece-fami/antece-fami.component';
import { TrataAnteComponent } from './trata-ante/trata-ante.component';
import { AntecePersonComponent } from './antece-person/antece-person.component';
import { ConsultaCompoComponent } from './consulta-compo/consulta-compo.component';
import { AlergiasComponent } from './alergias/alergias.component';
import { CrearAnteFliaComponent } from './crear-ante-flia/crear-ante-flia.component';
import { CrearAlergiaComponent } from './crear-alergia/crear-alergia.component';
import { ReporteTtlPacientesComponent } from './reporte-ttl-pacientes/reporte-ttl-pacientes.component';

import { BaseChartDirective } from 'ng2-charts';
import { RealtimeComponent } from './realtime/realtime.component';
import { CrearAsistenteComponent } from './crear-asistente/crear-asistente.component';
import { EditarAsistenteComponent } from './editar-asistente/editar-asistente.component';
import { AsistentePacientesComponent } from './asistente-pacientes/asistente-pacientes.component';
import { InformesAdminMedicosComponent } from './informes-admin-medicos/informes-admin-medicos.component';
import { InformesAdminPacientesComponent } from './informes-admin-pacientes/informes-admin-pacientes.component';
import { InformesDispositivosComponent } from './informes-dispositivos/informes-dispositivos.component';
import { ReporteTtlConsultasComponent } from './reporte-ttl-consultas/reporte-ttl-consultas.component';
import { TodasalermediComponent } from './todasalermedi/todasalermedi.component';
import { VerdatosfisicosComponent } from './verdatosfisicos/verdatosfisicos.component';

@NgModule({
  declarations: [VerdatosfisicosComponent,TodasalermediComponent,ReporteTtlConsultasComponent,InformesDispositivosComponent,InformesAdminPacientesComponent,InformesAdminMedicosComponent,AsistentePacientesComponent,EditarAsistenteComponent,CrearAsistenteComponent,RealtimeComponent ,ReporteTtlPacientesComponent,ChatUsuarioComponent,MenuComponent,AlertasComponent,ParametrosComponent,VizualizarParametroComponent,AnteceFamiComponent,AlergiasComponent,TrataAnteComponent,AntecePersonComponent,ConsultaCompoComponent,CrearAnteFliaComponent,CrearAlergiaComponent],
  exports:[VerdatosfisicosComponent,TodasalermediComponent,ReporteTtlConsultasComponent,InformesDispositivosComponent,InformesAdminPacientesComponent,InformesAdminMedicosComponent,AsistentePacientesComponent,EditarAsistenteComponent,CrearAsistenteComponent,RealtimeComponent,ReporteTtlPacientesComponent,ChatUsuarioComponent,MenuComponent,AlertasComponent,ParametrosComponent,VizualizarParametroComponent,AnteceFamiComponent,AlergiasComponent,TrataAnteComponent,AntecePersonComponent,ConsultaCompoComponent,CrearAnteFliaComponent,CrearAlergiaComponent],
  imports: [
    CommonModule,
    IonicModule,ReactiveFormsModule ,
    FormsModule,BaseChartDirective
  ],schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class ComponentesModule { }
