// src/patients/application/use-cases/get-pet-by-id.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPetRepository } from '../../domain/ports/pet.repository.interface';

interface GetPetByIdInput {
  id: string;
  orgId: string;
}

@Injectable()
export class GetPetByIdUseCase {
  constructor(
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: GetPetByIdInput) {
    // Pasamos tanto el id como el orgId tal como lo define tu interfaz
    const pet = await this.petRepository.findById(input.id, input.orgId);

    // Si devuelve null, significa que no existe o pertenece a otro tenant
    if (!pet) {
      throw new NotFoundException(`No se encontró la mascota o no tienes permisos para verla.`);
    }

    return pet;
  }
}