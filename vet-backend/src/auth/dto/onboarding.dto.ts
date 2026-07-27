import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class OnboardingDto {
  // Datos para crear la Organization
  @IsString()
  @MinLength(3)
  organizationName!: string;

  // Datos para crear el User (Admin)
  @IsString()
  @MinLength(3)
  adminFullName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol especificado no es válido' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(5)
  taxId?: string;

  @IsString()
  machineId!: string;

  @IsOptional()
  @IsString()
  licensePlan?: string;
}