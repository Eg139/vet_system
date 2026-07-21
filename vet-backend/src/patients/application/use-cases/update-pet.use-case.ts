// src/patients/application/use-cases/update-pet.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from '../../domain/entities/pet.entity';

export interface UpdatePetInput {
  id: string;
  orgId: string; 
  name?: string;
  species?: string;
  breed?: string;
  birthDate?: Date;
  bloodType?: string;
  chronicAllergies?: string[];
  photoUrl?: string | null;
}

@Injectable()
export class UpdatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: UpdatePetInput): Promise<Pet> {
    // 1. Buscamos el paciente garantizando el aislamiento multi-tenant
    const pet = await this.petRepository.findById(input.id, input.orgId);
    if (!pet) {
      throw new NotFoundException('La mascota no existe en esta organización.');
    }

    // 2. Delegamos la lógica y validaciones a los métodos semánticos del Dominio
    if (input.name) pet.updateName(input.name);
    if (input.species) pet.updateSpecies(input.species);
    if (input.breed) pet.updateBreed(input.breed);
    if (input.birthDate) pet.updateBirthDate(input.birthDate);
    if (input.bloodType) pet.actualizarTipoSangre(input.bloodType);

    // Si enviaron alergias en el DTO, las agregamos una a una a la entidad
    if (input.chronicAllergies && input.chronicAllergies.length > 0) {
      input.chronicAllergies.forEach((allergy) => pet.agregarAlergia(allergy));
    }

    // Actualizamos la foto si el atributo estuvo presente en la petición
    if (input.photoUrl !== undefined) {
      pet.updatePhotoUrl(input.photoUrl);
    }

    // 3. Persistimos los cambios a través del puerto del repositorio
    return await this.petRepository.save(pet);
  }
}