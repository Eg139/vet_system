import { VaccineEntity } from '../../../../domain/entities/vaccine.entity';
import { VaccineResponseDto } from '../../../dtos/vaccine-response.dto';

export class VaccineHttpMapper {
  static toResponseDto(entity: VaccineEntity): VaccineResponseDto {
    const dto = new VaccineResponseDto();
    dto.id = entity.getId();
    dto.patientId = entity.getPatientId();
    dto.vaccineName = entity.getVaccineName();
    dto.batchNumber = entity.getBatchNumber();
    dto.administeredBy = entity.getAdministeredBy();
    dto.applicationDate = entity.getApplicationDate();
    dto.nextDueDate = entity.getNextDueDate();
    dto.notes = entity.getNotes();
    dto.createdAt = entity.getCreatedAt();
    return dto;
  }
}