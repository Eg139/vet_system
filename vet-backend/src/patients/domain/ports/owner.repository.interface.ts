// src/patients/domain/ports/owner.repository.interface.ts

import { Owner } from '../entities/owner.entity';

// Token que usará NestJS para inyectar la dependencia
export const OWNER_REPOSITORY_TOKEN = 'IOwnerRepository';

export interface IOwnerRepository {
  findById(id: string, orgId: string): Promise<Owner | null>;
  findByEmail(email: string, orgId: string): Promise<Owner | null>;
  save(owner: Owner): Promise<Owner>;
  delete(id: string, orgId: string): Promise<void>;
}