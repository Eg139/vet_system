import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Treatment } from '../../domain/models/treatment.model';
import { TreatmentRepository } from '../../domain/ports/treatment.repository'; // 👈 Importa el puerto abstracto

@Injectable({
  providedIn: 'root'
})
export class GetActiveTreatmentsUseCase {
  // Inyectamos el puerto abstracto, no el adaptador de memoria
  private readonly treatmentRepository: TreatmentRepository = inject(TreatmentRepository);

  execute(patientId: string): Observable<Treatment[]> {
    return this.treatmentRepository.getActiveTreatmentsByPatientId(patientId);
  }
}