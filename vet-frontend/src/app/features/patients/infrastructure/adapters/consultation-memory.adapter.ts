import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Consultation } from '../../domain/models/consultation.model';
import { ConsultationRepository } from '../../domain/ports/consultation.repository';

@Injectable({
  providedIn: 'root'
})
export class ConsultationMemoryAdapter implements ConsultationRepository {
private readonly consultationsSignal = signal<Consultation[]>([
    new Consultation(
      '1',                         // 1. id
      'patient-uuid-123',          // 2. patientId (¡Este era el que faltaba o corría los demás!)
      'Dra. Sofía Martínez',       // 3. veterinarian
      new Date('2026-06-15T10:30:00'), // 4. date
      'El tutor refiere decaimiento leve...', // 5. subjective
      'T°: 39.2°C, FC: 110 lpm...',    // 6. objective
      'Gastritis aguda presuntiva...', // 7. assessment
      'Se indica ayuno de 6 horas...'  // 8. plan
    )
  ]);

  getByPetId(petId: string): Observable<Consultation[]> {
    // Si tus consultas tienen petId, puedes filtrarlas aquí. 
    // Por ahora retornamos el valor actual de la signal como Observable:
    return of(this.consultationsSignal());
  }

addConsultation(consultation: Consultation): Observable<Consultation> {
  this.consultationsSignal.update(current => [consultation, ...current]);
  return of(consultation); // Devuelve la instancia añadida
}
}