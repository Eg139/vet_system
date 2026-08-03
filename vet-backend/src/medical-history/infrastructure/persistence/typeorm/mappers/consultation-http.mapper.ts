import { ConsultationEntity } from '../../../../domain/entities/consultation.entity';
import { ConsultationResponseDto } from '../../../dtos/consultation-response.dto';

export class ConsultationHttpMapper {
  /**
   * Transforma la Entidad rica de Dominio
   * en el DTO seguro que consumirá el Frontend / API
   */
  static toResponseDto(entity: ConsultationEntity): ConsultationResponseDto {
    const dto = new ConsultationResponseDto();
    dto.id = entity.getId();
    dto.patientId = entity.getPatientId();
    dto.orgId = entity.getOrgId();
    dto.veterinarian = entity.getVeterinarian();
    dto.subjective = entity.getSubjective();
    dto.objective = entity.getObjective();
    dto.assessment = entity.getAssessment();
    dto.plan = entity.getPlan();
    dto.weight = entity.getWeight() ?? undefined;
    dto.temperature = entity.getTemperature() ?? undefined;
    dto.heartRate = entity.getHeartRate() ?? undefined;
    dto.respiratoryRate = entity.getRespiratoryRate() ?? undefined;
    dto.createdAt = entity.getCreatedAt();
    return dto;
  }
}