import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Hay token, lo dejamos pasar
  } else {
    // No hay token, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};