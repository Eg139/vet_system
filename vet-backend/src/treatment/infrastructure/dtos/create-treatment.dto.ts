import { IsString, IsNotEmpty, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateTreatmentDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string; // <--- Usamos el !

  @IsUUID()
  @IsNotEmpty()
  patientId!: string; // <--- Usamos el !

  @IsString()
  @IsNotEmpty()
  medicationName!: string; // <--- Usamos el !

  @IsString()
  @IsNotEmpty()
  dosage!: string; // <--- Usamos el !

  @IsDateString()
  @IsNotEmpty()
  startDate!: string; // <--- Usamos el !

  @IsDateString()
  @IsNotEmpty()
  endDate!: string; // <--- Usamos el !

  @IsString()
  @IsNotEmpty()
  prescribedBy!: string; // <--- Usamos el !

  @IsString()
  @IsOptional()
  instructions?: string; // Este se queda con ? porque es opcional
}