// src/patients/infrastructure/persistence/typeorm/mappers/pet.mapper.ts
import { Pet } from '../../../../domain/entities/pet.entity';
import { PetOrmEntity } from '../entities/pet.orm-entity';

export class PetMapper {
  /**
   * Transforma la entidad tonta de TypeORM (Base de datos)
   * en una entidad rica de Dominio (Negocio con métodos)
   */
  static toDomain(ormEntity: PetOrmEntity): Pet {
    return new Pet(
      ormEntity.id,
      ormEntity.name,
      ormEntity.species,
      ormEntity.breed,
      ormEntity.birthDate,
      ormEntity.ownerId,
      ormEntity.orgId,
      ormEntity.bloodType,
      ormEntity.isNeutered,
      // Detalle pro: clonamos el array para que el Dominio sea dueño de su propia referencia en memoria
      ormEntity.chronicAllergies ? [...ormEntity.chronicAllergies] : [],
    );
  }

  /**
   * Transforma la entidad rica de Dominio (Negocio)
   * en el molde tonto que TypeORM sabe guardar en las tablas SQL
   */
  static toOrm(domainEntity: Pet): PetOrmEntity {
    const ormEntity = new PetOrmEntity();
    
    // Usamos los getters públicos de la entidad de dominio
    ormEntity.id = domainEntity.getId();
    ormEntity.name = domainEntity.getName();
    ormEntity.species = domainEntity.getSpecies();
    ormEntity.breed = domainEntity.getBreed();
    ormEntity.birthDate = domainEntity.getBirthDate();
    ormEntity.ownerId = domainEntity.getOwnerId();
    ormEntity.orgId = domainEntity.getOrgId();
    
    // Mapeamos los campos del perfil clínico permanente
    ormEntity.bloodType = domainEntity.getBloodType();
    ormEntity.isNeutered = domainEntity.getIsNeutered();
    
    // Detalle pro: clonamos el array al salir del Dominio para aislar completamente la persistencia
    ormEntity.chronicAllergies = [...domainEntity.getChronicAllergies()];

    return ormEntity;
  }
}