import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';
import { GastronomiaComponent } from './gastronomia/gastronomia.component';
import { ComerciosComponent } from './comercios/comercios.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { ErrorComponent } from './error/error.component';
import { RegistroEmpresarioComponent } from './registro-empresario/registro-empresario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthService } from './service/auth.service';
import { RegistroAlojamientoComponent } from './registro-alojamiento/registro-alojamiento.component';
import { RegistroGastronomiaComponent } from './registro-gastronomia/registro-gastronomia.component';
import { RegistroComercioComponent } from './registro-comercio/registro-comercio.component';

const routes: Routes = [
  {path:'', component: InicioComponent},
  {path:'alojamiento', component:AlojamientoComponent},
  {path:'gastronomia', component:GastronomiaComponent},
  {path:'comercio', component:ComerciosComponent},
  {path: 'inicioSesion', component: InicioSesionComponent},
  {path: 'registrarse', component: RegistrarseComponent},
  {path: 'registroEmpresario', component: RegistroEmpresarioComponent},
  {path: 'registroAlojamiento', component: RegistroAlojamientoComponent},
  {path: 'registroGastronomia', component: RegistroGastronomiaComponent},
  {path: 'registroComercio', component: RegistroComercioComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthService] },
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }