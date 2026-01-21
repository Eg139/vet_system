import { Injectable, Inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {

  // Signals para el nombre y el logo (Reactividad pura)
  appName = signal<string>('VetSystem');
  appLogo = signal<string>('assets/default-logo.png');

  constructor(@Inject(DOCUMENT) private document: Document) {}

/**
   * Configura toda la identidad de la veterinaria de un golpe
   */
  setIdentity(name: string, logo: string, primaryColor: string, radius: string = '0.5rem'): void {
    // 1. Datos de texto e imagen
    this.appName.set(name);
    this.appLogo.set(logo);

    // 2. Estilos CSS
    const root = this.document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--radius-base', radius);
  }

  resetToDefault(): void {
    this.appName.set('VetSystem');
    this.appLogo.set('assets/default-logo.png');
    const root = this.document.documentElement;
    root.style.setProperty('--color-primary', '#3b82f6');
    root.style.setProperty('--radius-base', '0.5rem');
  }
}