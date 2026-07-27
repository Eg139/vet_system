// src/patients/infrastructure/persistence/typeorm/mappers/owner.mapper.ts

import { Owner } from '../../../../domain/entities/owner.entity';
import { OwnerOrmEntity } from '../entities/owner.orm-entity';

export class OwnerMapper {
  public static toDomain(ormEntity: OwnerOrmEntity): Owner {
    return new Owner(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      ormEntity.email,
      ormEntity.orgId,
      ormEntity.phone,
      ormEntity.userId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  public static toPersistence(domainEntity: Owner): OwnerOrmEntity {
    const ormEntity = new OwnerOrmEntity();
    ormEntity.id = domainEntity.getId();
    ormEntity.firstName = domainEntity.getFirstName();
    ormEntity.lastName = domainEntity.getLastName();
    ormEntity.email = domainEntity.getEmail();
    ormEntity.phone = domainEntity.getPhone() ?? ''
    ormEntity.userId = domainEntity.getUserId();
    ormEntity.orgId = domainEntity.getOrgId();
    return ormEntity;
  }
}