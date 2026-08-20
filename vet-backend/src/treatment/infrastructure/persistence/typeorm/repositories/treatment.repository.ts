import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITreatmentRepository } from '../../../../domain/ports/treatment.repository.interface';
import { TreatmentEntity } from '../../../../domain/entities/treatment.entity';
import { TreatmentTypeOrmEntity } from '../entities/treatment.typeorm-entity';
import { TreatmentMapper } from '../mappers/treatment-http.mapper';

@Injectable()
export class TreatmentRepository implements ITreatmentRepository {
  constructor(
    @InjectRepository(TreatmentTypeOrmEntity)
    private readonly repository: Repository<TreatmentTypeOrmEntity>,
  ) {}

  async save(treatment: TreatmentEntity): Promise<TreatmentEntity> {
    const persistenceEntity = TreatmentMapper.toPersistence(treatment);
    const savedEntity = await this.repository.save(persistenceEntity);
    return TreatmentMapper.toDomain(savedEntity);
  }

  async findByPatientId(patientId: string, orgId: string): Promise<TreatmentEntity[]> {
    const ormEntities = await this.repository.find({
      where: { patientId, orgId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map(TreatmentMapper.toDomain);
  }

  async findById(id: string, orgId: string): Promise<TreatmentEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id, orgId },
    });
    return ormEntity ? TreatmentMapper.toDomain(ormEntity) : null;
  }
}