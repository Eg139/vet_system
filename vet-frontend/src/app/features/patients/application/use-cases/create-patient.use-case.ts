// src/app/application/use-cases/create-patient.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepository, CreatePatientDto } from '../../domain/ports/patient.repository';
import { Patient } from '../../domain/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class CreatePatientUseCase {
  private readonly patientRepository = inject(PatientRepository);

  execute(patientData: CreatePatientDto): Observable<Patient> {
    return this.patientRepository.create(patientData);
  }
}