// src/patients/infrastructure/controllers/dtos/create-pet.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsUUID, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePetHttpDto {
  @ApiProperty({ description: 'Nombre del paciente', example: 'Rocco' })
  @IsString()
  @IsNotEmpty()
  name!: string; // Usamos '!' por la inicialización estricta de TS en DTOs si fuera necesario

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
    type: [String] // Le aclaramos explícitamente el tipo de array a Swagger
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Si viene un string plano por error, lo envolvemos en un array; si no, pasa igual
    if (typeof value === 'string') return [value];
    return value;
  })
  chronicAllergies?: string[];
}