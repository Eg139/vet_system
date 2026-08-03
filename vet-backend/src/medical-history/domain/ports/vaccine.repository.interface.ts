import { VaccineEntity } from '../entities/vaccine.entity';

export const VACCINE_REPOSITORY_TOKEN = Symbol('IVaccineRepository');

export interface IVaccineRepository {
  save(vaccine: VaccineEntity): Promise<VaccineEntity>;
  findByPatientId(patientId: string, orgId: string): Promise<VaccineEntity[]>;
  findById(id: string, orgId: string): Promise<VaccineEntity | null>;
}