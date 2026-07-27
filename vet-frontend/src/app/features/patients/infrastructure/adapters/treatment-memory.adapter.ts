import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TreatmentRepository } from '../../domain/ports/treatment.repository';
import { Treatment } from '../../domain/models/treatment.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentMemoryAdapter implements TreatmentRepository {
  
  private mockTreatments: Treatment[] = [
    new Treatment(
      't-1',
      '1', // Thor
      'Meloxicam 0.5 mg',
      '1/2 tableta cada 24 horas con alimento',
      new Date('2026-03-10'),
      new Date('2026-03-20'),
      'Dra. Gómez M.',
      'Administrar preferiblemente por la mañana tras el desayuno para evitar molestias gástricas.'
    ),
    new Treatment(
      't-2',
      '1',
      'Omeprazol 10 mg',
      '1 cápsula cada 24 horas en ayunas',
      new Date('2026-03-10'),
      new Date('2026-03-17'),
      'Dra. Gómez M.',
      'Protector gástrico de soporte durante el tratamiento con AINEs.'
    )
  ];

  getActiveTreatmentsByPatientId(patientId: string): Observable<Treatment[]> {
    const treatments = this.mockTreatments.filter(
      t => t.getPatientId() === patientId && t.isActive()
    );
    return of(treatments);
  }

  save(treatment: Treatment): Observable<void> {
    this.mockTreatments.push(treatment);
    return of(void 0);
  }
}