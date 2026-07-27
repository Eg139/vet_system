import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../domain/models/patient.model';
import { PatientRepository, UpdatePatientDto } from '../../domain/ports/patient.repository';

@Injectable({
  providedIn: 'root'
})
export class UpdatePatientUseCase {
  private readonly patientRepository: PatientRepository = inject(PatientRepository);

  execute(id: string, patientData: UpdatePatientDto): Observable<Patient> {
    return this.patientRepository.update(id, patientData);
  }
}