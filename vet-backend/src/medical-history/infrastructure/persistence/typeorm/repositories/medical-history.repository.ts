import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { IMedicalHistoryRepository } from '../../../../domain/ports/medical-history.repository.interface';
import { ConsultationEntity } from '../../../../domain/entities/consultation.entity';
import { ConsultationOrmEntity } from '../entities/consultation.orm-entity';

@Injectable()
export class MedicalHistoryRepository implements IMedicalHistoryRepository {
  constructor(
    @InjectRepository(ConsultationOrmEntity)
    private readonly consultationRepository: Repository<ConsultationOrmEntity>,
  ) {}

  // Mapeador de ORM Entity a Dominio Entity
  private toDomain(ormEntity: ConsultationOrmEntity): ConsultationEntity {
    return new ConsultationEntity(
      ormEntity.id,
      ormEntity.patientId,
      ormEntity.orgId,
      ormEntity.veterinarian,
      ormEntity.subjective,
      ormEntity.objective,
      ormEntity.assessment,
      ormEntity.plan,
      ormEntity.weight ?? undefined,
      ormEntity.temperature ?? undefined,
      ormEntity.heartRate ?? undefined,
      ormEntity.respiratoryRate ?? undefined,
      ormEntity.createdAt,
    );
  }

  // Mapeador de Dominio Entity a ORM Entity
  private toOrm(domainEntity: ConsultationEntity): ConsultationOrmEntity {
    const ormEntity = new ConsultationOrmEntity();
    ormEntity.id = domainEntity.getId();
    ormEntity.patientId = domainEntity.getPatientId();
    ormEntity.orgId = domainEntity.getOrgId();
    ormEntity.veterinarian = domainEntity.getVeterinarian();
    ormEntity.subjective = domainEntity.getSubjective();
    ormEntity.objective = domainEntity.getObjective();
    ormEntity.assessment = domainEntity.getAssessment();
    ormEntity.plan = domainEntity.getPlan();
    ormEntity.weight = domainEntity.getWeight() ?? null;
    ormEntity.temperature = domainEntity.getTemperature() ?? null;
    ormEntity.heartRate = domainEntity.getHeartRate() ?? null;
    ormEntity.respiratoryRate = domainEntity.getRespiratoryRate() ?? null;
    ormEntity.createdAt = domainEntity.getCreatedAt();
    return ormEntity;
  }

  async save(consultation: ConsultationEntity): Promise<ConsultationEntity> {
    const ormEntity = this.toOrm(consultation);
    const saved = await this.consultationRepository.save(ormEntity);
    return this.toDomain(saved);
  }

  async saveConsultationWithTransaction(
    consultation: ConsultationEntity,
    transactionalEntityManager: EntityManager,
  ): Promise<ConsultationEntity> {
    const ormEntity = this.toOrm(consultation);
    const saved = await transactionalEntityManager.save(ConsultationOrmEntity, ormEntity);
    return this.toDomain(saved);
  }

  async findByPatientId(patientId: string, orgId: string): Promise<ConsultationEntity[]> {
    const ormEntities = await this.consultationRepository.find({
      where: { patientId, orgId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map(e => this.toDomain(e));
  }

  async findById(id: string, orgId: string): Promise<ConsultationEntity | null> {
    const ormEntity = await this.consultationRepository.findOne({
      where: { id, orgId },
    });
    return ormEntity ? this.toDomain(ormEntity) : null;
  }
}