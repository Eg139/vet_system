import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LaboratoryRecord } from '../../domain/models/laboratory-record.model';
import { LaboratoryRepository } from '../../domain/ports/laboratory.repository';

@Injectable({
  providedIn: 'root'
})
export class GetPatientLaboratoryUseCase {
  // Inyectamos el puerto abstracto, no el adaptador de infraestructura
  private readonly laboratoryRepository: LaboratoryRepository = inject(LaboratoryRepository);

  execute(patientId: string): Observable<LaboratoryRecord[]> {
    return this.laboratoryRepository.getRecordsByPatientId(patientId);
  }
}