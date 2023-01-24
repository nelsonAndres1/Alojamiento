import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { TaralojaComponent } from './components/taraloja/taraloja.component';

const routes: Routes = [
  {path: '',redirectTo: '/panel/user',pathMatch: 'full'},
  {path: 'panel',component: SkeletonComponent,children: [{path: 'user',loadChildren: () =>import('@modules/user/user.module').then((m) => m.UserModule)},{path: '**',redirectTo: '/panel/user',pathMatch: 'full'}]},
  {path: 'login', component: LoginComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'taraloja', component: TaralojaComponent},
  {path: '**',redirectTo: '/panel/user',pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
