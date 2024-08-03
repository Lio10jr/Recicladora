import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./business/auth/auth.component').then(m => m.AuthComponent),
        canActivate: [noAuthGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./business/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [noAuthGuard]
    },
    {
        path: 'container',
        loadComponent: () => import('./business/container/home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard, roleGuard]
    },
    {
        path: 'recycle/:id',
        loadComponent: () => import('./business/container/recycle/recycle.component').then(m => m.RecycleComponent),
        canActivate: [authGuard, roleGuard]
    },
    {
        path: 'products',
        loadComponent: () => import('./business/products/products.component').then(m => m.ProductsComponent),
        canActivate: [authGuard, roleGuard]
    },
    {
        path: 'info',
        loadComponent: () => import('./business/info-user/info-user.component').then(m => m.InfoUserComponent),
        canActivate: [authGuard, roleGuard]
    },
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo:'/auth'
    }
];
