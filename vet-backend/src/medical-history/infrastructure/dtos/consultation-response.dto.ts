import { ApiProperty } from '@nestjs/swagger';

export class ConsultationResponseDto {
  @ApiProperty({ description: 'ID único de la consulta' })
  id!: string;

  @ApiProperty({ description: 'ID de la mascota paciente' })
  patientId!: string;

  @ApiProperty({ description: 'Organización propietaria' })
  orgId!: string;

  @ApiProperty({ description: 'Nombre del veterinario tratante' })
  veterinarian!: string;

  @ApiProperty({ description: 'Nota Subjetiva (S)' })
  subjective!: string;

  @ApiProperty({ description: 'Nota Objetivo (O)' })
  objective!: string;

  @ApiProperty({ description: 'Apreciación / Diagnóstico (A)' })
  assessment!: string;

  @ApiProperty({ description: 'Plan de tratamiento (P)' })
  plan!: string;

  @ApiProperty({ required: false, description: 'Peso de la mascota en kg' })
  weight?: number;

  @ApiProperty({ required: false, description: 'Temperatura en °C' })
  temperature?: number;

  @ApiProperty({ required: false, description: 'Frecuencia cardíaca (lpm)' })
  heartRate?: number;

  @ApiProperty({ required: false, description: 'Frecuencia respiratoria (rpm)' })
  respiratoryRate?: number;

  @ApiProperty({ description: 'Fecha y hora de la consulta' })
  createdAt!: Date;
}