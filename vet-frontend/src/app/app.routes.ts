import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard'; // Tu nuevo guard de invitados

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard] // <-- Si ya está logueado, lo saca del login y lo manda al dashboard
  },
  {
    path: 'backoffice',
    loadComponent: () => import('./features/layout/backoffice-layout/backoffice-layout.component').then(m => m.BackofficeLayoutComponent),
    canActivate: [authGuard], // El guard protege todo el entorno privado de un solo tiro
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./features/patients/pages/patient-list/patient-list.component').then(m => m.PatientListComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'backoffice', // Apuntar a la ruta base del layout es más limpio
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'backoffice' // Si se pierde y tiene sesión, va adentro; si no, el guard lo rebota al login
  }
];