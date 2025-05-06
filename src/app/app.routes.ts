import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { roleGuard } from './core/infrastructure/guards/role.guard';



export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-panel',
    canActivate: [roleGuard(['admim'])],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'empleado-panel',
    canActivate: [roleGuard(['empleado'])],
    loadComponent: () => import('./features/empleado/empleado.component').then(m => m.EmpleadoComponent)
  },
  {
    path: 'cliente-panel',
    canActivate: [roleGuard(['clientes'])],
    loadComponent: () => import('./features/cliente/cliente.component').then(m => m.ClienteComponent)
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/login' }
];
