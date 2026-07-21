// src/patients/application/use-cases/get-pet-by-id.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from '../../domain/entities/pet.entity';

export interface GetPetByIdInput {
  id: string;
  orgId: string;
}

@Injectable()
export class GetPetByIdUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN) // <-- Esto es lo que falta
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: GetPetByIdInput): Promise<Pet> {
    const pet = await this.petRepository.findById(input.id, input.orgId);

    if (!pet) {
      throw new NotFoundException(`Mascota con ID "${input.id}" no encontrada.`);
    }

    return pet;
  }
}