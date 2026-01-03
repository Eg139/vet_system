import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class OnboardingDto {
  // Datos para crear la Organization
  @IsString()
  @MinLength(3)
  organizationName: string;

  // Datos para crear el User (Admin)
  @IsString()
  @MinLength(3)
  adminFullName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional() // Permite que no venga en el JSON
  @IsString()
  @MinLength(5)
  taxId?: string;

  @IsString()
  machineId: string; // El ID que sacamos con systeminformation en el cliente

  // AGREGAR ESTO:
  @IsOptional()
  @IsString()
  licensePlan?: string;
}