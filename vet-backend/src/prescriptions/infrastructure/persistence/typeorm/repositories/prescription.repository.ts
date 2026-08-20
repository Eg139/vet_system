import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrescriptionRepository } from '../../../../domain/ports/prescription.repository.interface';
import { PrescriptionEntity } from '../../../../domain/entities/prescription.entity';
import { PrescriptionTypeOrmEntity } from '../entities/prescription.typeorm-entity';
import { PrescriptionMapper } from '../mappers/prescription.mapper';

@Injectable()
export class PrescriptionRepositoryImpl implements PrescriptionRepository {
  constructor(
    @InjectRepository(PrescriptionTypeOrmEntity)
    private readonly repository: Repository<PrescriptionTypeOrmEntity>,
  ) {}

  async save(prescription: PrescriptionEntity): Promise<PrescriptionEntity> {
    const persistenceModel = PrescriptionMapper.toPersistence(prescription);
    const saved = await this.repository.save(persistenceModel);
    return PrescriptionMapper.toDomain(saved);
  }

  async findByConsultationId(consultationId: string): Promise<PrescriptionEntity | null> {
    const found = await this.repository.findOneBy({ consultationId });
    return found ? PrescriptionMapper.toDomain(found) : null;
  }
}