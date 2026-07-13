// src/patients/application/use-cases/get-pets-by-owner.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from '../../domain/entities/pet.entity';

// Empaquetamos los parámetros en un DTO de aplicación para mantener la consistencia
export interface GetPetsByOwnerInput {
  ownerId: string;
  orgId: string; // Multi-tenancy obligatorio para aislar las búsquedas
}

@Injectable()
export class GetPetsByOwnerUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: GetPetsByOwnerInput): Promise<Pet[]> {
    // Orquestación directa pasando los datos extraídos del DTO de entrada al puerto
    return await this.petRepository.findByOwner(input.ownerId, input.orgId);
  }
}