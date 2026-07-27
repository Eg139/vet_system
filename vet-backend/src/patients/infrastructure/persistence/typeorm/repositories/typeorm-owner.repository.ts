// src/patients/infrastructure/persistence/typeorm/repositories/typeorm-owner.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOwnerRepository } from '../../../../domain/ports/owner.repository.interface';
import { Owner } from '../../../../domain/entities/owner.entity';
import { OwnerOrmEntity } from '../entities/owner.orm-entity';
import { OwnerMapper } from '../mappers/owner.mapper';

@Injectable()
export class TypeOrmOwnerRepository implements IOwnerRepository {
  constructor(
    @InjectRepository(OwnerOrmEntity)
    private readonly repository: Repository<OwnerOrmEntity>,
  ) {}

  async findById(id: string, orgId: string): Promise<Owner | null> {
    const ormEntity = await this.repository.findOne({
      where: { id, orgId },
    });

    if (!ormEntity) return null;
    return OwnerMapper.toDomain(ormEntity);
  }

  async findByEmail(email: string, orgId: string): Promise<Owner | null> {
    const ormEntity = await this.repository.findOne({
      where: { email, orgId },
    });

    if (!ormEntity) return null;
    return OwnerMapper.toDomain(ormEntity);
  }

  async save(owner: Owner): Promise<Owner> {
    const ormEntity = OwnerMapper.toPersistence(owner);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return OwnerMapper.toDomain(savedOrmEntity);
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.repository.delete({ id, orgId });
  }
}