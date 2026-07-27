import { Vaccine } from '../models/vaccine.model';
import { Observable } from 'rxjs';

export abstract class PatientVaccineRepository {
  abstract getByPatientId(patientId: string): Observable<Vaccine[]>;
  abstract save(patientId: string, vaccine: Vaccine): Observable<void>;
}