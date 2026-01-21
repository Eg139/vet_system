import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importante importar esto
import { BrandingService } from './core/services/branding.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Agregamos RouterOutlet aquí
  template: `
    <main>
      <router-outlet /> 
    </main>
  `
})
export class AppComponent {
  protected branding = inject(BrandingService);
  
  constructor() {
    // Opcional: Establecer colores por defecto al arrancar
    this.branding.resetToDefault();
  }
}