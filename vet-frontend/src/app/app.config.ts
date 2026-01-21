import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios (estándar en Angular 18+)
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),

    // 1. Cliente HTTP con el Interceptor de Seguridad
    provideHttpClient(
      withInterceptors([authInterceptor])
    ), 

    // 2. Configuración de PWA (Corregida y sin duplicados)
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};