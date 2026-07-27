// src/app/features/layout/backoffice-layout/backoffice-layout.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandingService } from '../../../core/services/branding.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-backoffice-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent], // 👈 Agregado aquí (RouterLink y RouterLinkActive ya viven dentro del sidebar)
  templateUrl: './backoffice-layout.component.html'
})
export class BackofficeLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Inyectamos tu branding service por si querés usar sus Signals para logos/colores
  public branding = inject(BrandingService);

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}