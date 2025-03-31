import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginasPage } from './paginas.page';

const routes: Routes = [
  {
    path: '',
    component: PaginasPage
  },
  {
    path: 'autentificacion',
    loadChildren: () => import('./autentificacion/autentificacion.module').then( m => m.AutentificacionPageModule)
  },
  {
    path: 'crear-usuarios',
    loadChildren: () => import('./crear-usuarios/crear-usuarios.module').then( m => m.CrearUsuariosPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'editar-user',
    loadChildren: () => import('./editar-user/editar-user.module').then( m => m.EditarUserPageModule)
  },
  {
    path: 'editarcontra',
    loadChildren: () => import('./editarcontra/editarcontra.module').then( m => m.EditarcontraPageModule)
  },
  {
    path: 'agregar-medico',
    loadChildren: () => import('./agregar-medico/agregar-medico.module').then( m => m.AgregarMedicoPageModule)
  },
 

  {
    path: 'cambiar-user',
    loadChildren: () => import('./cambiar-user/cambiar-user.module').then( m => m.CambiarUserPageModule)
  },
  {
    path: 'telemedicina',
    loadChildren: () => import('./telemedicina/telemedicina.module').then( m => m.TelemedicinaPageModule)
  },
  {
    path: 'crearmedicos',
    loadChildren: () => import('./crearmedicos/crearmedicos.module').then( m => m.CrearmedicosPageModule)
  },
  {
    path: 'datosmedico',
    loadChildren: () => import('./datosmedico/datosmedico.module').then( m => m.DatosmedicoPageModule)
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./pacientes/pacientes.module').then( m => m.PacientesPageModule)
  },
  {
    path: 'detalle-paciente',
    loadChildren: () => import('./detalle-paciente/detalle-paciente.module').then( m => m.DetallePacientePageModule)
  },
  {
    path: 'registraradministrador',
    loadChildren: () => import('./registraradministrador/registraradministrador.module').then( m => m.RegistraradministradorPageModule)
  },
  {
    path: 'estadousuarios',
    loadChildren: () => import('./estadousuarios/estadousuarios.module').then( m => m.EstadousuariosPageModule)
  },
  {
    path: 'editartodousuario',
    loadChildren: () => import('./editartodousuario/editartodousuario.module').then( m => m.EditartodousuarioPageModule)
  },
  {
    path: 'datostiemporeal',
    loadChildren: () => import('./datostiemporeal/datostiemporeal.module').then( m => m.DatostiemporealPageModule)
  },
  {
    path: 'parametros',
    loadChildren: () => import('./parametros/parametros.module').then( m => m.ParametrosPageModule)
  },
  {
    path: 'todasalertas',
    loadChildren: () => import('./todasalertas/todasalertas.module').then( m => m.TodasalertasPageModule)
  },
  {
    path: 'vizualizar-parametros',
    loadChildren: () => import('./vizualizar-parametros/vizualizar-parametros.module').then( m => m.VizualizarParametrosPageModule)
  },
  {
    path: 'alertas-medico',
    loadChildren: () => import('./alertas-medico/alertas-medico.module').then( m => m.AlertasMedicoPageModule)
  },
  {
    path: 'consultas',
    loadChildren: () => import('./consultas/consultas.module').then( m => m.ConsultasPageModule)
  },
  {
    path: 'datostago',
    loadChildren: () => import('./datostago/datostago.module').then( m => m.DatostagoPageModule)
  },
  
  {
    path: 'asistente',
    loadChildren: () => import('./asistente/asistente.module').then( m => m.AsistentePageModule)
  },
  {
    path: 'horarios-medico',
    loadChildren: () => import('./horarios-medico/horarios-medico.module').then( m => m.HorariosMedicoPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'recuperar-username',
    loadChildren: () => import('./recuperar-username/recuperar-username.module').then( m => m.RecuperarUsernamePageModule)
  },
  {
    path: 'cambiardispositivo',
    loadChildren: () => import('./cambiardispositivo/cambiardispositivo.module').then( m => m.CambiardispositivoPageModule)
  },
  {
    path: 'reportes-medicos',
    loadChildren: () => import('./reportes-medicos/reportes-medicos.module').then( m => m.ReportesMedicosPageModule)
  },
  {
    path: 'pacientes-asistente',
    loadChildren: () => import('./pacientes-asistente/pacientes-asistente.module').then( m => m.PacientesAsistentePageModule)
  },
  {
    path: 'informes-admin',
    loadChildren: () => import('./informes-admin/informes-admin.module').then( m => m.InformesAdminPageModule)
  },
  {
    path: 'crear-parametros',
    loadChildren: () => import('./crear-parametros/crear-parametros.module').then( m => m.CrearParametrosPageModule)
  },
  {
    path: 'historial-medi-paci',
    loadChildren: () => import('./historial-medi-paci/historial-medi-paci.module').then( m => m.HistorialMediPaciPageModule)
  },
  {
    path: 'tipoalerta',
    loadChildren: () => import('./tipoalerta/tipoalerta.module').then( m => m.TipoalertaPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'proteciondedatos',
    loadChildren: () => import('./proteciondedatos/proteciondedatos.module').then( m => m.ProteciondedatosPageModule)
  },
  {
    path: 'politicas',
    loadChildren: () => import('./politicas/politicas.module').then( m => m.PoliticasPageModule)
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginasPageRoutingModule {}
