// src/patients/application/use-cases/create-pet.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { IPetRepository, PET_REPOSITORY_TOKEN } from '../../domain/ports/pet.repository.interface';
import { Pet } from 'src/patients/domain/entities/pet.entity';

// 1. DTO de aplicación actualizado con soporte para la carga inicial biológica y foto
export interface CreatePetInput {
  name: string;
  species: string;
  breed: string; 
  birthDate: Date;
  ownerId: string;
  orgId: string;
  bloodType?: string;        // Opcional en el alta
  isNeutered?: boolean;      // Opcional en el alta
  chronicAllergies?: string[]; // Opcional en el alta
  photoUrl?: string | null;  // Opcional en el alta
}

@Injectable()
export class CreatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: CreatePetInput): Promise<Pet> {
    // Primero validamos la fecha antes de instanciar para proteger el flujo
    if (input.birthDate > new Date()) {
      throw new Error('La fecha de nacimiento no puede ser una fecha futura.');
    }

    // 2. Instanciamos la entidad respetando el orden EXACTO de tu constructor final
    const newPet = new Pet(
      crypto.randomUUID(), 
      input.name,
      input.species,
      input.breed,
      input.birthDate,
      input.ownerId,
      input.orgId,
      input.bloodType,        // Pasa con su valor por defecto ('Desconocido') si viene undefined
      input.isNeutered,       // Pasa con su valor por defecto (false) si viene undefined
      input.chronicAllergies,  // Pasa con su valor por defecto ([]) si viene undefined
      input.photoUrl,         // Pasa la URL de la foto de perfil o null/undefined
    );

    // 3. Mandamos a guardar al puerto
    return await this.petRepository.save(newPet);
  }
}