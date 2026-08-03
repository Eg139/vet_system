import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsultationHttpDto {
  @ApiProperty({ description: 'Nota subjetiva de la consulta (Anamnesis)', example: '...' })
  @IsString()
  @IsNotEmpty()
  subjective!: string;

  @ApiProperty({ description: 'Nota objetiva (Hallazgos físicos)', example: '...' })
  @IsString()
  @IsNotEmpty()
  objective!: string;

  @ApiProperty({ description: 'Evaluación o diagnóstico presuntivo', example: '...' })
  @IsString()
  @IsNotEmpty()
  assessment!: string;

  @ApiProperty({ description: 'Plan médico a seguir', example: '...' })
  @IsString()
  @IsNotEmpty()
  plan!: string;

  // Las opcionales pueden llevar ?
  @ApiPropertyOptional({ description: 'Peso actual en kg', example: 14.5 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Temperatura corporal en °C', example: 39.2 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Frecuencia cardíaca (lpm)', example: 110 })
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ description: 'Frecuencia respiratoria (rpm)', example: 24 })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;
}