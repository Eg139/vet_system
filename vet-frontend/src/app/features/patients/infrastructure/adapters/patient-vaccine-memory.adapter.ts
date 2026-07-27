import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientVaccineRepository } from '../../domain/ports/patient-vaccine.repository';
import { Vaccine } from '../../domain/models/vaccine.model';

@Injectable({
  providedIn: 'root'
})
export class PatientVaccineMemoryAdapter implements PatientVaccineRepository {
  private mockVaccines: Map<string, Vaccine[]> = new Map([
    [
      '1', // ID de ejemplo para el paciente Thor
      [
        new Vaccine(
          'vac-1',                           // id
          'VACCINE',                         // type ('VACCINE' | 'DEWORMER')
          'Antirrábica Anual',               // name
          new Date('2025-10-10'),            // applicationDate
          new Date('2026-10-10'),            // dueDate
          'Dra. Gómez M.',                   // appliedBy
          'LOTE-XYZ-9988',                   // batchNumber (obligatorio)
          'prod-ref-01'                      // commercialProductId (opcional)
        )      
      ]
    ]
  ]);

  getByPatientId(patientId: string): Observable<Vaccine[]> {
    const vaccines = this.mockVaccines.get(patientId) || [];
    return of(vaccines);
  }

  save(patientId: string, vaccine: Vaccine): Observable<void> {
    const current = this.mockVaccines.get(patientId) || [];
    this.mockVaccines.set(patientId, [...current, vaccine]);
    return of(void 0);
  }
}