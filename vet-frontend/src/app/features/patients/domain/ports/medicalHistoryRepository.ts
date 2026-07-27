import { Observable } from 'rxjs';
import { MedicalConsultation } from '../models/medical-consultation.model'; // (Ajustá la ruta según dónde tengas guardado el modelo)
import { Patient } from '../models/patient.model';


export abstract class PatientRepository {
  abstract getById(id: string): Observable<Patient>; // Trae solo la ficha biológica
}

export abstract class MedicalHistoryRepository {
  abstract getByPetId(petId: string): Observable<MedicalConsultation[]>; // Trae las consultas paginadas o filtradas
  abstract addConsultation(consultation: MedicalConsultation): Observable<void>;
}