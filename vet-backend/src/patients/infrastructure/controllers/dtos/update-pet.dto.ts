import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdatePetHttpDto {
  @ApiPropertyOptional({ description: 'Nuevo nombre', example: 'Rocco' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Nueva especie', example: 'Canino' })
  @IsString()
  @IsOptional()
  species?: string;

  @ApiPropertyOptional({ description: 'Nueva raza', example: 'Labrador' })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiPropertyOptional({ description: 'Nueva fecha de nacimiento', example: '2024-03-16T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ description: 'Nuevo tipo de sangre', example: 'DEA 1.1 Positivo' })
  @IsString()
  @IsOptional()
  bloodType?: string;

  @ApiPropertyOptional({ description: 'Nueva alergia crónica a agregar', example: 'Ivermectina' })
  @IsString()
  @IsOptional()
  newAllergy?: string;
}