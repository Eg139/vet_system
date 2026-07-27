import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// 1. Importaciones de Ports (Hexagonal) y sus adaptadores
import { PatientRepository } from './features/patients/domain/ports/patient.repository';
import { PatientMemoryAdapter } from './features/patients/infrastructure/adapters/patient-memory.adapter';

import { ConsultationRepository } from './features/patients/domain/ports/consultation.repository';
import { ConsultationMemoryAdapter } from './features/patients/infrastructure/adapters/consultation-memory.adapter';

import { TimelineRepository } from './features/patients/domain/ports/timeline.repository';
import { TimelineMemoryAdapter } from './features/patients/infrastructure/adapters/timeline-memory.adapter';

import { PatientVaccineRepository } from './features/patients/domain/ports/patient-vaccine.repository';
import { PatientVaccineMemoryAdapter } from './features/patients/infrastructure/adapters/patient-vaccine-memory.adapter';

import { TreatmentMemoryAdapter } from './features/patients/infrastructure/adapters/treatment-memory.adapter';
import { TreatmentRepository } from './features/patients/domain/ports/treatment.repository';

import { LaboratoryMemoryAdapter } from './features/patients/infrastructure/adapters/laboratory-memory.adapter';
import { LaboratoryRepository } from './features/patients/domain/ports/laboratory.repository';

import { MedicalHistoryRepository } from './features/patients/domain/ports/medicalHistoryRepository';
import { MedicalHistoryMemoryAdapter } from './features/patients/infrastructure/adapters/medical-history-memory.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    provideRouter(routes),

    // Cliente HTTP con el Interceptor de Seguridad
    provideHttpClient(
      withInterceptors([authInterceptor])
    ), 

    // Configuración de PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // Vinculaciones Hexagonales: Puertos abstractos -> Adaptadores Mock en memoria
    { provide: PatientRepository, useClass: PatientMemoryAdapter },
    { provide: ConsultationRepository, useClass: ConsultationMemoryAdapter },
    { provide: TimelineRepository, useClass: TimelineMemoryAdapter },
    { provide: PatientVaccineRepository, useClass: PatientVaccineMemoryAdapter },
    { provide: TreatmentRepository, useClass: TreatmentMemoryAdapter },
    { provide: LaboratoryRepository, useClass: LaboratoryMemoryAdapter },
    { provide: MedicalHistoryRepository, useClass: MedicalHistoryMemoryAdapter }
  ]
};