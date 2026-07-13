// src/patients/domain/ports/pet.repository.interface.ts
import { Pet } from '../entities/pet.entity';

// El Token que usará NestJS para inyectar la dependencia en JS
export const PET_REPOSITORY_TOKEN = 'IPetRepository';

export interface IPetRepository {
  save(pet: Pet): Promise<Pet>;
  findById(id: string, orgId: string): Promise<Pet | null>;
  findByOwner(ownerId: string, orgId: string): Promise<Pet[]>;
}