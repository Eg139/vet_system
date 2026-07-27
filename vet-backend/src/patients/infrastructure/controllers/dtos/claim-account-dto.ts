// src/patients/application/dtos/claim-account.dto.ts

import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimAccountDto {
  @ApiProperty({
    example: 'carlos.perez@gmail.com',
    description: 'Correo electrónico registrado previamente en la clínica por el dueño',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Nueva contraseña elegida por el cliente (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID de la organización/veterinaria (tenant)',
  })
  @IsUUID('4', { message: 'El ID de la organización debe ser un UUID v4 válido.' })
  @IsNotEmpty({ message: 'El orgId es obligatorio.' })
  orgId!: string;
}