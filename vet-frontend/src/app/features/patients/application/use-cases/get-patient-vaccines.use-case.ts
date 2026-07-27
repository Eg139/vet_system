import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vaccine } from '../../domain/models/vaccine.model';
import { PatientVaccineRepository } from '../../domain/ports/patient-vaccine.repository';

@Injectable({
  providedIn: 'root'
})
export class GetPatientVaccinesUseCase {
  // Inyectamos el puerto abstracto, no el adaptador de memoria
  private readonly vaccineRepository: PatientVaccineRepository = inject(PatientVaccineRepository);

  execute(patientId: string): Observable<Vaccine[]> {
    return this.vaccineRepository.getByPatientId(patientId);
  }
}