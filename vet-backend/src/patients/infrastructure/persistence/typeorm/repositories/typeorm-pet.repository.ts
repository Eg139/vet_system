// src/patients/infrastructure/persistence/typeorm/repositories/typeorm-pet.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPetRepository } from '../../../../domain/ports/pet.repository.interface';
import { Pet } from '../../../../domain/entities/pet.entity';
import { PetOrmEntity } from '../entities/pet.orm-entity';
import { PetMapper } from '../mappers/pet.mapper';

@Injectable()
export class TypeOrmPetRepository implements IPetRepository {
  constructor(
    @InjectRepository(PetOrmEntity)
    private readonly typeOrmRepository: Repository<PetOrmEntity>,
  ) {}

  // 1. Guardar o Actualizar
  async save(pet: Pet): Promise<Pet> {
    // Convertimos el objeto de dominio puro al formato que entiende TypeORM
    const ormEntity = PetMapper.toOrm(pet);
    
    // Guardamos en la base de datos SQL
    const savedEntity = await this.typeOrmRepository.save(ormEntity);
    
    // Devolvemos el objeto transformado otra vez a dominio por si la capa superior lo necesita
    return PetMapper.toDomain(savedEntity);
  }

  // 2. Buscar por ID garantizando el aislamiento Multi-tenant
  async findById(id: string, orgId: string): Promise<Pet | null> {
    const ormEntity = await this.typeOrmRepository.findOne({
      where: { id, orgId }, // Clave: Nadie puede leer una mascota de otra clínica
    });

    if (!ormEntity) return null;

    return PetMapper.toDomain(ormEntity);
  }

  // 3. Buscar todas las mascotas de un mismo dueño
  async findByOwner(ownerId: string, orgId: string): Promise<Pet[]> {
    const ormEntities = await this.typeOrmRepository.find({
      where: { ownerId, orgId },
      order: { name: 'ASC' }, // Las traemos ordenadas alfabéticamente
    });

    // Mapeamos el array completo de entidades ORM a entidades de dominio
    return ormEntities.map(entity => PetMapper.toDomain(entity));
  }
}