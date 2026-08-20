import { PrescriptionEntity } from '../entities/prescription.entity';

export const PRESCRIPTION_REPOSITORY_TOKEN = 'PRESCRIPTION_REPOSITORY_TOKEN';

export interface PrescriptionRepository {
  save(prescription: PrescriptionEntity): Promise<PrescriptionEntity>;
  findByConsultationId(consultationId: string): Promise<PrescriptionEntity | null>;
}