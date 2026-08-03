import { ApiProperty } from '@nestjs/swagger';

export class MedicalHistoryTimelineItemDto {
  @ApiProperty({ description: 'ID único del evento (puede ser consulta, vacuna, etc.)' })
  id!: string;

  @ApiProperty({ 
    description: 'Tipo de evento médico', 
    enum: ['CONSULTATION', 'VACCINE', 'DEWORMING', 'SURGERY', 'LAB'] 
  })
  type!: 'CONSULTATION' | 'VACCINE' | 'DEWORMING' | 'SURGERY' | 'LAB';

  @ApiProperty({ description: 'Fecha y hora en que ocurrió el evento' })
  date!: Date;

  @ApiProperty({ description: 'Profesional o responsable del evento' })
  veterinarian!: string;

  @ApiProperty({ description: 'Título o resumen corto para mostrar en la tarjeta de la UI' })
  title!: string;

  @ApiProperty({ 
    required: false, 
    description: 'Detalles específicos de la consulta SOAP (si el tipo es CONSULTATION)' 
  })
  soapDetails?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };

  @ApiProperty({ 
    required: false, 
    description: 'Constantes vitales asociadas al evento' 
  })
  vitals?: {
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
  };
}