import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuariosPage } from './paginas/crear-usuarios/crear-usuarios.page';
import { DetallePacientePage } from './paginas/detalle-paciente/detalle-paciente.page';
import { AlertasComponent } from './componentes/alertas/alertas.component';
import { VizualizarParametroComponent } from './componentes/vizualizar-parametro/vizualizar-parametro.component';
import { ChatUsuarioComponent } from './componentes/chat-usuario/chat-usuario.component';
import { AntecePersonComponent } from './componentes/antece-person/antece-person.component';
import { AnteceFamiComponent } from './componentes/antece-fami/antece-fami.component';
import { AlergiasComponent } from './componentes/alergias/alergias.component';
import { TrataAnteComponent } from './componentes/trata-ante/trata-ante.component';
import { ConsultaCompoComponent } from './componentes/consulta-compo/consulta-compo.component';
import { CrearAnteFliaComponent } from './componentes/crear-ante-flia/crear-ante-flia.component';
import { CrearAlergiaComponent } from './componentes/crear-alergia/crear-alergia.component';
import { ReporteTtlPacientesComponent } from './componentes/reporte-ttl-pacientes/reporte-ttl-pacientes.component';
import { RealtimeComponent } from './componentes/realtime/realtime.component';
import { CrearAsistenteComponent } from './componentes/crear-asistente/crear-asistente.component';
import { EditarAsistenteComponent } from './componentes/editar-asistente/editar-asistente.component';
import { AsistentePacientesComponent } from './componentes/asistente-pacientes/asistente-pacientes.component';
import { InformesDispositivosComponent } from './componentes/informes-dispositivos/informes-dispositivos.component';
import { InformesAdminMedicosComponent } from './componentes/informes-admin-medicos/informes-admin-medicos.component';
import { InformesAdminPacientesComponent } from './componentes/informes-admin-pacientes/informes-admin-pacientes.component';
import { ReporteTtlConsultasComponent } from './componentes/reporte-ttl-consultas/reporte-ttl-consultas.component';
import { TodasalermediComponent } from './componentes/todasalermedi/todasalermedi.component';
import { DatosFisicosComponent } from './componentes/datos-fisicos/datos-fisicos.component';
import { VerdatosfisicosComponent } from './componentes/verdatosfisicos/verdatosfisicos.component';

const routes: Routes = [
  { path: 'detalle-paciente/:id_usuario/:nombre/:apellido/:cedula/:telefono', component: DetallePacientePage },
  { path: 'editartodousuario/:id', loadChildren: () => import('./paginas/editartodousuario/editartodousuario.module').then(m => m.EditartodousuarioPageModule) },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'paginas',
    loadChildren: () => import('./paginas/paginas.module').then(m => m.PaginasPageModule)
  },
  {
    path: 'autentificacion',
    loadChildren: () => import('./paginas/autentificacion/autentificacion.module').then(m => m.AutentificacionPageModule)
  },
  {
    path: 'crear-usuarios',
    component: CrearUsuariosPage
  },
  { path: 'antece-person', component: AntecePersonComponent },
  { path: 'antece-fami', component: AnteceFamiComponent },
  { path: 'alergias', component: AlergiasComponent },
  { path: 'trata-ante', component: TrataAnteComponent },
  { path: 'consulta-compo', component: ConsultaCompoComponent },

  { path: 'crear-ante-flia', component: CrearAnteFliaComponent},
  { path: 'crear-alergia', component: CrearAlergiaComponent},
  { path: 'reporte-ttl-pacientes', component: ReporteTtlPacientesComponent},
  { path: 'realtime', component: RealtimeComponent},
  { path: 'crear-asistente', component: CrearAsistenteComponent},
  { path: 'editar-asistente', component: EditarAsistenteComponent},
  { path: 'vizualizar-parametro', component: VizualizarParametroComponent},
  { path: 'informes-dispositivos', component: InformesDispositivosComponent},
  { path: 'informes-admin-medicos', component: InformesAdminMedicosComponent},
  { path: 'informes-admin-pacientes', component: InformesAdminPacientesComponent},
  { path: 'asistente-pacientes', component: AsistentePacientesComponent},
  { path: 'reporte-ttl-consultas', component: ReporteTtlConsultasComponent},
  { path: 'todasalermedi', component: TodasalermediComponent},
  { path: 'datos-fisicos', component: DatosFisicosComponent },
  { path: 'verdatosfisicos', component: VerdatosfisicosComponent },
  {
    path: 'inicio',
    loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.InicioPageModule)
  }
  ,
  {
    path: 'usuario',
    loadChildren: () => import('./paginas/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  
  {
    path: 'editar-user',
    loadChildren: () => import('./paginas/editar-user/editar-user.module').then( m => m.EditarUserPageModule)
  },
  {
    path: 'editarcontra',
    loadChildren: () => import('./paginas/editarcontra/editarcontra.module').then( m => m.EditarcontraPageModule)
  },
  {
    path: 'agregar-medico',
    loadChildren: () => import('./paginas/agregar-medico/agregar-medico.module').then( m => m.AgregarMedicoPageModule)
  },
 

  {
    path: 'cambiar-user',
    loadChildren: () => import('./paginas/cambiar-user/cambiar-user.module').then( m => m.CambiarUserPageModule)
  },
  {
    path: 'telemedicina',
    loadChildren: () => import('./paginas/telemedicina/telemedicina.module').then( m => m.TelemedicinaPageModule)
  },
  {
    path: 'crearmedicos',
    loadChildren: () => import('./paginas/crearmedicos/crearmedicos.module').then( m => m.CrearmedicosPageModule)
  },

  {
    path: 'datosmedico',
    loadChildren: () => import('./paginas/datosmedico/datosmedico.module').then( m => m.DatosmedicoPageModule)
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./paginas/pacientes/pacientes.module').then( m => m.PacientesPageModule)
  },
  {
    path: 'detalle-paciente',
    loadChildren: () => import('./paginas/detalle-paciente/detalle-paciente.module').then( m => m.DetallePacientePageModule)
  },
  {
    path: 'registraradministrador',
    loadChildren: () => import('./paginas/registraradministrador/registraradministrador.module').then( m => m.RegistraradministradorPageModule)
  },
  {
    path: 'estadousuarios',
    loadChildren: () => import('./paginas/estadousuarios/estadousuarios.module').then( m => m.EstadousuariosPageModule)
  },
  {
    path: 'editartodousuario',
    loadChildren: () => import('./paginas/editartodousuario/editartodousuario.module').then( m => m.EditartodousuarioPageModule)
  },
  {
    path: 'datostiemporeal',
    loadChildren: () => import('./paginas/datostiemporeal/datostiemporeal.module').then( m => m.DatostiemporealPageModule)
  },
  {
    path: 'parametros',
    loadChildren: () => import('./paginas/parametros/parametros.module').then( m => m.ParametrosPageModule)
  },
  { path: 'alertas', component: AlertasComponent },
  {
    path: 'todasalertas',
    loadChildren: () => import('./paginas/todasalertas/todasalertas.module').then( m => m.TodasalertasPageModule)
  },
  {
    path: 'vizualizar-parametros',
    loadChildren: () => import('./paginas/vizualizar-parametros/vizualizar-parametros.module').then( m => m.VizualizarParametrosPageModule)
  },
  
  { path: 'vizualizar-parametro', component: VizualizarParametroComponent },
  {
    path: 'alertas-medico',
    loadChildren: () => import('./paginas/alertas-medico/alertas-medico.module').then( m => m.AlertasMedicoPageModule)
  },
  {
    path: 'consultas',
    loadChildren: () => import('./paginas/consultas/consultas.module').then( m => m.ConsultasPageModule)
  },
  {
    path: 'datostago',
    loadChildren: () => import('./paginas/datostago/datostago.module').then( m => m.DatostagoPageModule)
  },
 
  {
    path: 'asistente',
    loadChildren: () => import('./paginas/asistente/asistente.module').then( m => m.AsistentePageModule)
  },
  {
    path: 'horarios-medico',
    loadChildren: () => import('./paginas/horarios-medico/horarios-medico.module').then( m => m.HorariosMedicoPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./paginas/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'recuperar-username',
    loadChildren: () => import('./paginas/recuperar-username/recuperar-username.module').then( m => m.RecuperarUsernamePageModule)
  },
  {
    path: 'cambiardispositivo',
    loadChildren: () => import('./paginas/cambiardispositivo/cambiardispositivo.module').then( m => m.CambiardispositivoPageModule)
  },
  {
    path: 'reportes-medicos',
    loadChildren: () => import('./paginas/reportes-medicos/reportes-medicos.module').then( m => m.ReportesMedicosPageModule)
  },
  {
    path: 'pacientes-asistente',
    loadChildren: () => import('./paginas/pacientes-asistente/pacientes-asistente.module').then( m => m.PacientesAsistentePageModule)
  },
  {
    path: 'informes-admin',
    loadChildren: () => import('./paginas/informes-admin/informes-admin.module').then( m => m.InformesAdminPageModule)
  },
  {
    path: 'crear-parametros',
    loadChildren: () => import('./paginas/crear-parametros/crear-parametros.module').then( m => m.CrearParametrosPageModule)
  },
  {
    path: 'historial-medi-paci',
    loadChildren: () => import('./paginas/historial-medi-paci/historial-medi-paci.module').then( m => m.HistorialMediPaciPageModule)
  },
  {
    path: 'tipoalerta',
    loadChildren: () => import('./paginas/tipoalerta/tipoalerta.module').then( m => m.TipoalertaPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./paginas/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'proteciondedatos',
    loadChildren: () => import('./paginas/proteciondedatos/proteciondedatos.module').then( m => m.ProteciondedatosPageModule)
  },
  {
    path: 'politicas',
    loadChildren: () => import('./paginas/politicas/politicas.module').then( m => m.PoliticasPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
