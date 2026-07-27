import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineEvent } from '../../domain/models/timeline-event.model';
import { TimelineRepository } from '../../domain/ports/timeline.repository';

@Injectable({
  providedIn: 'root'
})
export class TimelineMemoryAdapter implements TimelineRepository {
  
  private mockEvents: TimelineEvent[] = [
    new TimelineEvent(
      't-1',
      '1',
      new Date('2026-03-10'),
      'consultation',
      'Consulta General y Vacunación',
      'Paciente alerta, normohidratado. Se aplica vacuna séxtuple con éxito.',
      'Dr. Eric'
    ),
    new TimelineEvent(
      't-2',
      '1',
      new Date('2025-11-05'),
      'consultation',
      'Atención por Otitis Externa',
      'Eritema leve en conducto auditivo externo izquierdo. Tratamiento con gotas óticas.',
      'Dr. Eric'
    ),
    new TimelineEvent(
      't-3',
      '1',
      new Date('2025-08-15'),
      'vaccine',
      'Refuerzo Anual Antirrábica',
      'Aplicación de dosis anual obligatoria de vacuna antirrábica sin reacciones adversas.',
      'Dra. Sofía'
    ),
    new TimelineEvent(
      't-4',
      '1',
      new Date('2025-04-10'),
      'surgery',
      'Profilaxis Dental (Limpieza de Tartar)',
      'Procedimiento bajo sedación controlada para remoción de placa bacteriana y pulido.',
      'Dr. Eric'
    )
  ];

  getTimelineByPetId(petId: string): Observable<TimelineEvent[]> {
    const events = this.mockEvents
      .filter(e => e.getPetId() === petId)
      .sort((a, b) => b.getDate().getTime() - a.getDate().getTime()); // Ordenadas de más reciente a más antigua
      
    return of(events);
  }
}