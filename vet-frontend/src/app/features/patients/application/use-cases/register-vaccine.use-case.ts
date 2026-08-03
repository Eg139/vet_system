// src/app/domain/use-cases/register-vaccine.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Vaccine } from '../../domain/models/vaccine.model';
import { PatientVaccineRepository } from '../../domain/ports/patient-vaccine.repository';
import { Observable } from 'rxjs';

export interface RegisterVaccineDto {
  patientId: string;
  consultationId: string;
  vaccineName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterVaccineUseCase {
  private readonly vaccineRepository = inject(PatientVaccineRepository);

  execute(dto: RegisterVaccineDto): Observable<void> {
    if (!dto.vaccineName || dto.vaccineName.trim() === '') {
      throw new Error('El nombre de la vacuna es obligatorio.');
    }

    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1); // Vencimiento por defecto a 1 año

    // Instanciamos la Vaccine con los 8 argumentos que exige su constructor
    const newVaccine = new Vaccine(
      Date.now().toString(),                  // 1. id
      'VACCINE',                              // 2. type ('VACCINE' | 'DEWORMER')
      dto.vaccineName,                        // 3. name
      today,                                  // 4. applicationDate
      nextYear,                               // 5. dueDate
      'Dr. Eric',                             // 6. appliedBy
      'LOTE-DEMO-2026',                       // 7. batchNumber (Temporal para la demo)
      undefined                               // 8. commercialProductId (Opcional)
    );

    return this.vaccineRepository.save(dto.patientId, newVaccine);
  }
}