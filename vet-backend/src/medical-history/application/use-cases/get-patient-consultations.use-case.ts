import { Injectable, Inject } from '@nestjs/common';
import { 
  IMedicalHistoryRepository, 
  MEDICAL_HISTORY_REPOSITORY_TOKEN 
} from '../../domain/ports/medical-history.repository.interface';
import { ConsultationEntity } from '../../domain/entities/consultation.entity';

@Injectable()
export class GetPatientConsultationsUseCase {
  constructor(
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
  ) {}

  async execute(patientId: string, orgId: string): Promise<ConsultationEntity[]> {
    // Aquí podrías agregar validaciones extra si necesitas (ej: verificar que el paciente exista)
    return await this.medicalHistoryRepository.findByPatientId(patientId, orgId);
  }
}