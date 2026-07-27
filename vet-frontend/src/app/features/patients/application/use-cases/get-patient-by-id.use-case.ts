import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepository } from '../../domain/ports/patient.repository';
import { Patient } from '../../domain/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class GetPatientByIdUseCase {
  private repository = inject(PatientRepository);

  execute(id: string): Observable<Patient | undefined> {
    return this.repository.getPatientById(id);
  }
}