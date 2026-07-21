// src/app/features/layout/backoffice-layout/backoffice-layout.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandingService } from '../../../core/services/branding.service';

@Component({
  selector: 'app-backoffice-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './backoffice-layout.component.html'
})
export class BackofficeLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Inyectamos tu branding service por si querés usar sus Signals para logos/colores
  public branding = inject(BrandingService);

  logout(): void {
    this.authService.logout(); // Asegurate de tener este método en tu service para borrar el token
    this.router.navigate(['/login']);
  }
}