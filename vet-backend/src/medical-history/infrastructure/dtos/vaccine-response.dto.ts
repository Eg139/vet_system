    import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccineResponseDto {
  @ApiProperty({ description: 'ID único de la vacuna', example: 'uuid-v4' })
  id: string;

  @ApiProperty({ description: 'ID de la mascota paciente', example: 'uuid-v4' })
  patientId: string;

  @ApiProperty({ description: 'Nombre de la vacuna', example: 'Séxtuple Canina' })
  vaccineName: string;

  @ApiProperty({ description: 'Número de lote', example: 'LOT-987654' })
  batchNumber: string;

  @ApiProperty({ description: 'Veterinario que administró la vacuna', example: 'Dr. Pérez' })
  administeredBy: string;

  @ApiProperty({ description: 'Fecha de aplicación', example: '2026-07-30T10:00:00.000Z' })
  applicationDate: Date;

  @ApiPropertyOptional({ description: 'Fecha de próximo refuerzo', example: '2027-07-30T10:00:00.000Z' })
  nextDueDate?: Date;

  @ApiPropertyOptional({ description: 'Notas clínicas', example: 'Sin reacciones secundarias.' })
  notes?: string;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-07-30T10:00:00.000Z' })
  createdAt: Date;
}