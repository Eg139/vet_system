import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepository } from '../../domain/ports/patient.repository';
import { Patient } from '../../domain/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class GetPatientsUseCase {
  constructor(private patientRepository: PatientRepository) {}

  execute(): Observable<Patient[]> {
    return this.patientRepository.getPatients();
  }
}