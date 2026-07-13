// src/patients/application/use-cases/neuter-pet.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from '../../domain/entities/pet.entity';

// El DTO de entrada para este caso de uso es súper simple y enfocado
export interface NeuterPetInput {
  petId: string;
  orgId: string; // Multi-tenancy para asegurar que pertenece a la clínica
}

@Injectable()
export class NeuterPetUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: NeuterPetInput): Promise<Pet> {
    // 1. Buscamos el paciente en la base de datos a través del puerto
    const pet = await this.petRepository.findById(input.petId, input.orgId);
    
    if (!pet) {
      throw new NotFoundException('El paciente no existe en esta organización.');
    }

    // 2. ¡Ejecutamos el método semántico de tu entidad de dominio!
    // Si la mascota ya estaba castrada, la misma entidad va a lanzar el Error acá.
    pet.registrarCastracion();

    // 3. Persistimos los cambios ya protegidos por el dominio
    return await this.petRepository.save(pet);
  }
}