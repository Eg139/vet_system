import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { 
  IMedicalHistoryRepository, 
  MEDICAL_HISTORY_REPOSITORY_TOKEN 
} from '../../domain/ports/medical-history.repository.interface';
import { ConsultationEntity } from '../../domain/entities/consultation.entity';
import { UpdateConsultationHttpDto } from '../../infrastructure/dtos/update-consultation.dto';

@Injectable()
export class UpdateConsultationUseCase {
  constructor(
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
  ) {}

async execute(id: string, orgId: string, dto: UpdateConsultationHttpDto): Promise<ConsultationEntity> {
    // 1. Buscamos la consulta existente
    const consultation = await this.medicalHistoryRepository.findById(id, orgId);

    if (!consultation) {
      throw new NotFoundException(`La consulta médica con ID "${id}" no fue encontrada.`);
    }

    // 2. Actualizamos las notas SOAP usando los métodos de negocio de la entidad
    if (dto.subjective !== undefined) {
      consultation.updateSubjective(dto.subjective);
    }
    if (dto.objective !== undefined) {
      consultation.updateObjective(dto.objective);
    }
    if (dto.assessment !== undefined) {
      consultation.updateAssessment(dto.assessment);
    }
    if (dto.plan !== undefined) {
      consultation.updatePlan(dto.plan);
    }

    // 3. Actualizamos los signos vitales agrupados
    if (
      dto.weight !== undefined ||
      dto.temperature !== undefined ||
      dto.heartRate !== undefined ||
      dto.respiratoryRate !== undefined
    ) {
      consultation.updateVitals(
        dto.weight,
        dto.temperature,
        dto.heartRate,
        dto.respiratoryRate
      );
    }

    // 4. Guardamos los cambios en el repositorio
    return await this.medicalHistoryRepository.save(consultation);
  }
}