import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterVaccineHttpDto {
  @ApiProperty({ description: 'Nombre de la vacuna aplicada', example: 'Séxtuple Canina' })
  @IsString()
  @IsNotEmpty()
  vaccineName!: string;

  @ApiProperty({ description: 'Número de lote de la vacuna', example: 'LOT-987654' })
  @IsString()
  @IsNotEmpty()
  batchNumber!: string;

  @ApiProperty({ description: 'Fecha de aplicación (ISO 8601)', example: '2026-07-30T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  applicationDate!: string;

  @ApiPropertyOptional({ description: 'Fecha sugerida para el próximo refuerzo', example: '2027-07-30T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @ApiPropertyOptional({ description: 'Observaciones o reacciones adversas', example: 'Paciente toleró bien la aplicación sin fiebre.' })
  @IsString()
  @IsOptional()
  notes?: string;
}