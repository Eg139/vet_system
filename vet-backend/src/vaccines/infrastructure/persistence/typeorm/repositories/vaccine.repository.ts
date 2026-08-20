import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { IVaccineRepository } from '../../../../domain/ports/vaccine.repository.interface';
import { VaccineEntity } from '../../../../domain/entities/vaccine.entity';
import { VaccineTypeOrmEntity } from '../entities/vaccine.typeorm-entity';

@Injectable()
export class VaccineRepository implements IVaccineRepository {
  constructor(
    @InjectRepository(VaccineTypeOrmEntity)
    private readonly repository: Repository<VaccineTypeOrmEntity>,
  ) {}

  // Mapeador de ORM Entity a Dominio Entity
private toDomain(orm: VaccineTypeOrmEntity): VaccineEntity {
    return new VaccineEntity(
      orm.id,
      orm.patientId,
      orm.orgId,
      orm.vaccineName,
      orm.batchNumber,
      orm.administeredBy,
      new Date(orm.applicationDate),
      orm.nextDueDate ? new Date(orm.nextDueDate) : undefined, // Maneja null convirtiéndolo a undefined
      orm.notes ?? undefined,                                   // Maneja null convirtiéndolo a undefined
      new Date(orm.createdAt),
    );
  }

  // Mapeador de Dominio Entity a ORM Entity
  private toOrm(domain: VaccineEntity): VaccineTypeOrmEntity {
    const orm = new VaccineTypeOrmEntity();
    orm.id = domain.getId();
    orm.patientId = domain.getPatientId();
    orm.orgId = domain.getOrgId();
    orm.vaccineName = domain.getVaccineName();
    orm.batchNumber = domain.getBatchNumber();
    orm.administeredBy = domain.getAdministeredBy();
    orm.applicationDate = domain.getApplicationDate();
    orm.nextDueDate = domain.getNextDueDate() ?? null;
    orm.notes = domain.getNotes() ?? null;
    orm.createdAt = domain.getCreatedAt();
    return orm;
  }

  async save(vaccine: VaccineEntity): Promise<VaccineEntity> {
    const ormEntity = this.toOrm(vaccine);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  // Preparado para transacciones futuras (inventario + vacuna)
  async saveVaccineWithTransaction(
    vaccine: VaccineEntity,
    transactionalEntityManager: EntityManager,
  ): Promise<VaccineEntity> {
    const ormEntity = this.toOrm(vaccine);
    const saved = await transactionalEntityManager.save(VaccineTypeOrmEntity, ormEntity);
    return this.toDomain(saved);
  }

  async findByPatientId(patientId: string, orgId: string): Promise<VaccineEntity[]> {
    const results = await this.repository.find({
      where: { patientId, orgId },
      order: { applicationDate: 'DESC' },
    });
    return results.map(e => this.toDomain(e));
  }

  async findById(id: string, orgId: string): Promise<VaccineEntity | null> {
    const result = await this.repository.findOne({
      where: { id, orgId },
    });
    return result ? this.toDomain(result) : null;
  }
}