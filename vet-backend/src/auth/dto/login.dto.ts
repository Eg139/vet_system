import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Opcional: para documentar tu API

export class LoginDto {
  @ApiProperty({ example: 'admin@veterinaria.com' }) // Documentación
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  readonly email: string; // 'readonly' asegura inmutabilidad

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'La contraseña es demasiado larga' })
  readonly password: string;
}