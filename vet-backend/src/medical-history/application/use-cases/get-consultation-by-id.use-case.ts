import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { 
  IMedicalHistoryRepository, 
  MEDICAL_HISTORY_REPOSITORY_TOKEN 
} from '../../domain/ports/medical-history.repository.interface';
import { ConsultationEntity } from '../../domain/entities/consultation.entity';

@Injectable()
export class GetConsultationByIdUseCase {
  constructor(
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
  ) {}

  async execute(id: string, orgId: string): Promise<ConsultationEntity> {
    const consultation = await this.medicalHistoryRepository.findById(id, orgId);

    if (!consultation) {
      throw new NotFoundException(`La consulta médica con ID "${id}" no fue encontrada.`);
    }

    return consultation;
  }
}