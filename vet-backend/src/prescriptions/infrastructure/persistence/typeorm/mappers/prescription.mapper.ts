import { PrescriptionEntity } from '../../../../domain/entities/prescription.entity';
import { PrescriptionTypeOrmEntity } from '../entities/prescription.typeorm-entity';

export class PrescriptionMapper {
  static toDomain(orm: PrescriptionTypeOrmEntity): PrescriptionEntity {
    return new PrescriptionEntity(
      orm.id,
      orm.consultationId,
      orm.orgId,
      orm.patientName,
      orm.veterinarianName,
      orm.licenseNumber,
      orm.diagnosis,
      orm.indications,
      orm.createdAt,
    );
  }

  static toPersistence(domain: PrescriptionEntity): PrescriptionTypeOrmEntity {
    const orm = new PrescriptionTypeOrmEntity();
    orm.id = domain.getId();
    orm.consultationId = domain.getConsultationId();
    orm.orgId = domain.getOrgId();
    orm.patientName = domain.getPatientName();
    orm.veterinarianName = domain.getVeterinarianName();
    orm.licenseNumber = domain.getLicenseNumber();
    orm.diagnosis = domain.getDiagnosis();
    orm.indications = domain.getIndications();
    return orm;
  }
}