import { Injectable, inject } from '@angular/core';
import { TreatmentRepository } from '../../domain/ports/treatment.repository';
import { Treatment } from '../../domain/models/treatment.model';
import { Observable } from 'rxjs';

export interface RegisterTreatmentDto {
  patientId: string;
  consultationId: string; // Aunque el modelo no lo pide directo como propiedad en el constructor, se puede usar en las instrucciones o dejarlo mapeado
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterTreatmentUseCase {
  private readonly treatmentRepository = inject(TreatmentRepository);

  execute(dto: RegisterTreatmentDto): Observable<void> {
    if (!dto.description || dto.description.trim() === '') {
      throw new Error('La descripción del tratamiento es obligatoria.');
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7); // Duración por defecto de 1 semana para la demo

    // Instanciamos el Treatment respetando los 9 argumentos requeridos
    const newTreatment = new Treatment(
      Date.now().toString(),          // id
      dto.patientId,                  // patientId
      dto.description,                // medicationName (usamos la descripción del form)
      'Dosis única / según pauta',    // dosage por defecto
      today,                          // startDate
      nextWeek,                       // endDate
      'Dr. Eric',                     // prescribedBy por defecto
      'Administrar según indicaciones en consulta.', // instructions
      true                            // active
    );

    return this.treatmentRepository.save(newTreatment);
  }
}