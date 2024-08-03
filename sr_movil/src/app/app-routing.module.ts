import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./business/auth/auth.module').then( m => m.AuthPageModule),
    canActivate: [noAuthGuard],
  },
  {
    path: 'menu',
    loadChildren: () => import('./business/tab/tab.module').then( m => m.TabPageModule),
    canActivate: [authGuard, roleGuard],
  },
  {
      path: '',
      redirectTo: '/auth',
      pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo:'/auth'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
