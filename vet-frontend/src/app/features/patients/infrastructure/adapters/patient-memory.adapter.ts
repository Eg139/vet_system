import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientRepository, CreatePatientDto, UpdatePatientDto } from '../../domain/ports/patient.repository';
import { Patient } from '../../domain/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientMemoryAdapter implements PatientRepository {
  
  private mockPatients: Patient[] = [
    new Patient(
      '1', 
      'Thor', 
      'Canino', 
      'Yorkshire Terrier', 
      new Date('2020-03-15'), 
      'owner-1', 
      'org-1', 
      'DEA 1.1', 
      true,                // isNeutered
      ['Pollo'],           // chronicAllergies
      null,                // photoUrl
      14.2,                // weightKg
      new Date('2026-06-10'), // lastWeightDate
      'María Fernanda Gómez', // ownerName
      '+5491100000000'     // ownerPhone
    ),
    new Patient(
      '2', 
      'Luna', 
      'Felino', 
      'Siamés', 
      new Date('2021-07-20'), 
      'owner-2', 
      'org-1', 
      'A', 
      false, 
      [], 
      null,
      4.1,
      new Date('2026-05-01'),
      'Carlos Pérez',
      '+5491111111111'
    ),
    new Patient(
      '3', 
      'Simba', 
      'Canino', 
      'Golden Retriever', 
      new Date('2019-11-10'), 
      'owner-3', 
      'org-1', 
      'DEA 1.2', 
      true, 
      [], 
      null,
      30.5,
      new Date('2026-06-01'),
      'Valeria Ríos',
      '+5491122223333'
    ),
    new Patient(
      '4', 
      'Mila', 
      'Felino', 
      'Maine Coon', 
      new Date('2022-02-14'), 
      'owner-4', 
      'org-1', 
      'B', 
      false, 
      ['Pescado'], 
      null,
      6.2,
      new Date('2026-05-20'),
      'Esteban Quito',
      '+5491144445555'
    ),
    new Patient(
      '5', 
      'Rocky', 
      'Canino', 
      'Bulldog Francés', 
      new Date('2023-01-05'), 
      'owner-5', 
      'org-1', 
      'DEA 7', 
      false, 
      ['Lácteos', 'Pollo'], 
      null,
      11.8,
      new Date('2026-06-15'),
      'Lucía Méndez',
      '+5491166667777'
    )
  ];

  getPatients(): Observable<Patient[]> {
    return of(this.mockPatients);
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    const patient = this.mockPatients.find(p => p.getId() === id);
    return of(patient);
  }

  create(patientData: CreatePatientDto): Observable<Patient> {
    const newId = (this.mockPatients.length + 1).toString();

    const newPatient = new Patient(
      newId,
      patientData.name,
      patientData.species,
      patientData.breed,
      patientData.birthDate ?? new Date(),
      'owner-gen',
      'org-1',
      patientData.bloodType ?? 'Desconocido',
      patientData.isDonor ?? false,
      patientData.allergies ?? [],
      null,
      patientData.weightKg ?? 0,
      new Date(),
      patientData.ownerName,
      patientData.ownerPhone
    );

    this.mockPatients.push(newPatient);
    return of(newPatient);
  }

  update(id: string, patientData: UpdatePatientDto): Observable<Patient> {
    const index = this.mockPatients.findIndex(p => p.getId() === id);
    
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    const current = this.mockPatients[index];

    // Mapeo utilizando los métodos de lectura correctos de tu modelo
    const updatedPatient = new Patient(
      current.getId(),
      patientData.name ?? current.getName(),
      patientData.species ?? current.getSpecies(),
      patientData.breed ?? current.getBreed(),
      patientData.birthDate ?? current.getBirthDate(),
      current.getOwnerId(),
      current.getOrgId(), // 👈 Corregido de getOrganizationId a getOrgId
      patientData.bloodType ?? current.getBloodType(),
      current.getIsNeutered(), // Mantiene el estado actual si no viene en el DTO
      patientData.allergies ?? current.getChronicAllergies(), // 👈 Corregido a getChronicAllergies
      current.getPhotoUrl(),
      patientData.weightKg ?? current.getWeight() ?? undefined, // 👈 Corregido a getWeight()
      patientData.weightKg !== undefined ? new Date() : (current.getLastWeightDate() ?? undefined),
      patientData.ownerName ?? current.getOwnerName() ?? undefined,
      patientData.ownerPhone ?? current.getOwnerPhone() ?? undefined
    );

    this.mockPatients[index] = updatedPatient;
    return of(updatedPatient);
  }
  
  delete(id: string): Observable<boolean> {
      const index = this.mockPatients.findIndex(p => p.getId() === id); // 👈 Usar this.mockPatients
      if (index !== -1) {
        this.mockPatients.splice(index, 1);
        return of(true);
      }
      return of(false);
    }
}