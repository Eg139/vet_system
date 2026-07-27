import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

export interface CreatePatientDto {
  name: string;
  species: string;
  breed: string;
  birthDate?: Date;
  ownerName: string;
  ownerPhone: string;
  weightKg?: number;
  bloodType?: string;
  isDonor?: boolean;
  allergies?: string[];
}

// 👈 Añadimos el DTO de actualización (todos sus campos son opcionales)
export interface UpdatePatientDto {
  name?: string;
  species?: string;
  breed?: string;
  birthDate?: Date;
  ownerName?: string;
  ownerPhone?: string;
  weightKg?: number;
  bloodType?: string;
  isDonor?: boolean;
  allergies?: string[];
}

export abstract class PatientRepository {
  abstract getPatients(): Observable<Patient[]>;
  abstract getPatientById(id: string): Observable<Patient | undefined>;
  abstract create(patientData: CreatePatientDto): Observable<Patient>;
  abstract update(id: string, patientData: UpdatePatientDto): Observable<Patient>;
  abstract delete(id: string): Observable<boolean>;
}