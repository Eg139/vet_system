import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultation } from '../../domain/models/consultation.model';
import { ConsultationRepository } from '../../domain/ports/consultation.repository';

@Injectable({
  providedIn: 'root'
})
export class CreateConsultationUseCase {
  private readonly consultationRepository = inject(ConsultationRepository);

    execute(consultation: Consultation): Observable<Consultation> {
    return this.consultationRepository.addConsultation(consultation);
    }
}