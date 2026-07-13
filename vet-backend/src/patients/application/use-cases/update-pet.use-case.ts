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
  newAllergy?: string; // Mantenemos la posibilidad de registrar una alergia desde el perfil
}

@Injectable()
export class UpdatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(input: UpdatePetInput): Promise<Pet> {
    // 1. Buscamos el paciente garantizando el multi-tenancy
    const pet = await this.petRepository.findById(input.id, input.orgId);
    if (!pet) {
      throw new NotFoundException('La mascota no existe en esta organización.');
    }

    // 2. Delegamos TODA la lógica y validación a los métodos de la entidad
    if (input.name) pet.updateName(input.name);
    if (input.species) pet.updateSpecies(input.species);
    if (input.breed) pet.updateBreed(input.breed);
    if (input.birthDate) pet.updateBirthDate(input.birthDate);
    if (input.bloodType) pet.actualizarTipoSangre(input.bloodType);
    if (input.newAllergy) pet.agregarAlergia(input.newAllergy);

    // 3. Persistimos los cambios
    return await this.petRepository.save(pet);
  }
}