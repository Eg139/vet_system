import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si ya está logueado, lo mandamos al panel
    router.navigate(['/backoffice/dashboard']);
    return false;
  }

  return true; // No está logueado, puede ver el login libremente
};