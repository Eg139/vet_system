import { TreatmentEntity } from '../entities/treatment.entity';

export const TREATMENT_REPOSITORY_TOKEN = Symbol('ITreatmentRepository');

export interface ITreatmentRepository {
  save(treatment: TreatmentEntity): Promise<TreatmentEntity>;
  findByPatientId(patientId: string, orgId: string): Promise<TreatmentEntity[]>;
  findById(id: string, orgId: string): Promise<TreatmentEntity | null>;
}