// src/patients/application/use-cases/transfer-pet-ownership.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from '../../domain/entities/pet.entity';

export interface TransferOwnershipInput {
  petId: string;
  newOwnerId: string;
  orgId: string;
}

@Injectable()
export class TransferPetOwnershipUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: TransferOwnershipInput): Promise<Pet> {
    const pet = await this.petRepository.findById(input.petId, input.orgId);
    if (!pet) {
      throw new NotFoundException('Paciente no encontrado en esta organización.');
    }

    // Usamos el getter público que definiste en tu entidad final
    if (pet.getOwnerId() === input.newOwnerId) {
      throw new Error('La mascota ya pertenece a este dueño.');
    }

    // Cambiamos el dueño de forma controlada
    pet.transferOwnership(input.newOwnerId);
    return await this.petRepository.save(pet);
  }
}