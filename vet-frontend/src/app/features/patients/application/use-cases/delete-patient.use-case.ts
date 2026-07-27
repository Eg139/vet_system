// src/app/features/patients/application/use-cases/delete-patient.use-case.ts
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepository } from '../../domain/ports/patient.repository';

@Injectable({
  providedIn: 'root'
})
export class DeletePatientUseCase {
  private readonly patientRepository = inject(PatientRepository);

  execute(id: string): Observable<boolean> {
    return this.patientRepository.delete(id);
  }
}