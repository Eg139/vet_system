import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';

export abstract class ConsultationRepository {
  abstract getByPetId(petId: string): Observable<Consultation[]>;
  abstract addConsultation(consultation: Consultation): Observable<Consultation>; // Retorna la entidad
}