import { Observable } from 'rxjs';
import { LaboratoryRecord } from '../models/laboratory-record.model';

export abstract class LaboratoryRepository {
  abstract getRecordsByPatientId(patientId: string): Observable<LaboratoryRecord[]>;
  abstract save(record: LaboratoryRecord): Observable<void>;
}