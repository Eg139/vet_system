// src/patients/infrastructure/controllers/dtos/create-pet.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsDateString, 
  IsUUID, 
  IsOptional, 
  IsBoolean, 
  IsArray, 
  IsUrl 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePetHttpDto {
  @ApiProperty({ description: 'Nombre del paciente', example: 'Rocco' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Especie del animal', example: 'Canino' })
  @IsString()
  @IsNotEmpty()
  species!: string;

  @ApiProperty({ description: 'Raza del animal', example: 'Ovejero Alemán' })
  @IsString()
  @IsNotEmpty()
  breed!: string;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '2024-03-16T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  birthDate!: string;

  @ApiProperty({ description: 'ID del propietario (Cliente)', example: 'a9b8c7d6-e5f4-3c2b-1a09-fedcba987654' })
  @IsUUID()
  @IsNotEmpty()
  ownerId!: string;

  @ApiPropertyOptional({ 
    description: 'URL de la foto de perfil almacenada en Cloudinary', 
    example: 'https://res.cloudinary.com/vetsaas/image/upload/v123456/pets/rocco.jpg' 
  })
  @IsOptional()
  @IsUrl({}, { message: 'La foto de perfil debe ser una URL válida.' })
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'Tipo de sangre biológico', example: 'DEA 1.1 Negativo', default: 'Desconocido' })
  @IsString()
  @IsOptional()
  bloodType?: string;

  @ApiPropertyOptional({ description: 'Estado de castración', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isNeutered?: boolean;

  @ApiPropertyOptional({ 
    description: 'Lista de alergias crónicas detectadas', 
    example: ['Penicilina', 'Dipirona'], 
    default: [],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  chronicAllergies?: string[];
}