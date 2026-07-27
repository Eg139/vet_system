import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MedicalConsultation } from '../../domain/models/medical-consultation.model';
import { MedicalHistoryRepository } from '../../domain/ports/medicalHistoryRepository';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryMemoryAdapter implements MedicalHistoryRepository {
  
  private mockConsultations: MedicalConsultation[] = [
    new MedicalConsultation(
      'c-1',
      '1', 
      new Date('2026-03-10'),
      'vet-user-1',
      'Paciente alerta, normohidratado, sin prurito aparente.', // S (Subjetivo)
      'FC: 100 lpm, FR: 24 rpm, T°: 38.5°C. Mucosas rosadas.',   // O (Objetivo)
      'Aparente buen estado de salud. Refuerzo anual al día.',    // A (Assessment / Diagnóstico)
      'Se aplica vacuna séxtuple. Próximo control en 1 año.'      // P (Plan)
    ),
    new MedicalConsultation(
      'c-2',
      '1',
      new Date('2025-11-05'),
      'vet-user-1',
      'Leve rascado en zona auricular reportado por el tutor.',
      'Eritema leve en conducto auditivo externo izquierdo.',
      'Otitis externa leve estacional.',
      'Limpieza con solución ótica y aplicación de gotas cada 12 horas por 5 días.'
    ),
    // ➕ Nuevas consultas mock de ejemplo
    new MedicalConsultation(
      'c-3',
      '1',
      new Date('2025-07-20'),
      'vet-user-1',
      'Tutor refiere decaimiento leve tras paseo por el parque y pérdida ligera de apetito.',
      'FC: 110 lpm, T°: 39.1°C. Dolor leve a la palpación abdominal caudal.',
      'Gastroenteritis leve por indisposición alimentaria.',
      'Dieta blanda por 48 horas, protector gástrico y reposo domiciliario.'
    ),
    new MedicalConsultation(
      'c-4',
      '1',
      new Date('2025-02-14'),
      'vet-user-1',
      'Control periódico preventivo de rutina y revisión general.',
      'FC: 95 lpm, T°: 38.3°C. Peso estable, excelente condición corporal (3/5).',
      'Paciente sano apto para actividades físicas normales.',
      'Desparasitación interna preventiva administrada en consultorio.'
    )
  ];

  getByPetId(petId: string): Observable<MedicalConsultation[]> {
    const consultations = this.mockConsultations.filter(c => c.getPetId() === petId);
    return of(consultations);
  }

  addConsultation(consultation: MedicalConsultation): Observable<void> {
    this.mockConsultations.push(consultation);
    return of(void 0);
  }
}