// src/patients/infrastructure/controllers/dtos/update-pet.dto.ts
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePetHttpDto } from './create-pet.dto';

// Omitimos 'ownerId' porque la transferencia de titularidad 
// se maneja en su propio endpoint dedicado (transferOwnership)
export class UpdatePetHttpDto extends PartialType(
  OmitType(CreatePetHttpDto, ['ownerId'] as const),
) {}