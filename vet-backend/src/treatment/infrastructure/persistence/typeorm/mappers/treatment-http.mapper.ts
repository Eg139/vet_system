import { TreatmentEntity } from '../../../../domain/entities/treatment.entity';
import { TreatmentTypeOrmEntity } from '../entities/treatment.typeorm-entity';

export class TreatmentMapper {
  public static toDomain(ormEntity: TreatmentTypeOrmEntity): TreatmentEntity {
    return new TreatmentEntity(
      ormEntity.id,
      ormEntity.patientId,
      ormEntity.orgId,
      ormEntity.medicationName,
      ormEntity.dosage,
      ormEntity.startDate,
      ormEntity.endDate,
      ormEntity.prescribedBy,
      ormEntity.instructions ?? '',
      ormEntity.active,
      ormEntity.createdAt,
    );
  }

  public static toPersistence(domainEntity: TreatmentEntity): TreatmentTypeOrmEntity {
    const ormEntity = new TreatmentTypeOrmEntity();
    ormEntity.id = domainEntity.getId();
    ormEntity.patientId = domainEntity.getPatientId();
    ormEntity.orgId = domainEntity.getOrgId();
    ormEntity.medicationName = domainEntity.getMedicationName();
    ormEntity.dosage = domainEntity.getDosage();
    ormEntity.startDate = domainEntity.getStartDate();
    ormEntity.endDate = domainEntity.getEndDate();
    ormEntity.prescribedBy = domainEntity.getPrescribedBy();
    ormEntity.instructions = domainEntity.getInstructions();
    ormEntity.active = domainEntity.isActive();
    ormEntity.createdAt = domainEntity.getCreatedAt();
    return ormEntity;
  }
}