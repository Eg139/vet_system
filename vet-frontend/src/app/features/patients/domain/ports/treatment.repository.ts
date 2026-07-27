import { Observable } from 'rxjs';
import { Treatment } from '../models/treatment.model';

export abstract class TreatmentRepository {
  abstract getActiveTreatmentsByPatientId(patientId: string): Observable<Treatment[]>;
  abstract save(treatment: Treatment): Observable<void>;
}