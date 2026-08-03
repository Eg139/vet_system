import { EntityManager } from 'typeorm';
import { ConsultationEntity } from '../entities/consultation.entity';

export const MEDICAL_HISTORY_REPOSITORY_TOKEN = Symbol('IMedicalHistoryRepository');

export interface IMedicalHistoryRepository {
  save(consultation: ConsultationEntity): Promise<ConsultationEntity>;
  
  // Método transaccional requerido por el UseCase
  saveConsultationWithTransaction(
    consultation: ConsultationEntity, 
    transactionalEntityManager: EntityManager
  ): Promise<ConsultationEntity>;

  findByPatientId(patientId: string, orgId: string): Promise<ConsultationEntity[]>;
  findById(id: string, orgId: string): Promise<ConsultationEntity | null>;
}