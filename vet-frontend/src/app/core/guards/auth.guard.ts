import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Ajustá la ruta según tu estructura

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Sesión real, válida y activa
  }

  // Si no es válido o expiró, lo mandamos derecho al login
  router.navigate(['/login']);
  return false;
};