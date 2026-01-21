import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingService } from '../../core/services/branding.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html' // O el template inline que usamos antes
})
export class DashboardComponent implements OnInit {
  // Inyectamos el servicio que ya tiene los datos del token
  protected branding = inject(BrandingService);

  ngOnInit() {
    console.log('Branding actual:', this.branding.appName());
  }

  // ... tus datos de citas y pacientes
}