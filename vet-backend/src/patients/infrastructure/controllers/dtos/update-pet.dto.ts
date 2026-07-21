// src/patients/infrastructure/controllers/dtos/update-pet.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePetHttpDto } from './create-pet.dto';

export class UpdatePetHttpDto extends PartialType(CreatePetHttpDto) {}