import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'vet.maria@ejemplo.com',
    description: 'Correo electrónico único del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({
    example: 'Dra. María González',
    description: 'Nombre completo del usuario o profesional',
  })
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole', // 👈 Agregamos esto para que Swagger dibuje un Select/Dropdown impecable
    example: UserRole.VET,
    description: 'Rol dentro de la clínica (ADMIN, VET, OWNER)',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol asignado no es válido' })
  role?: UserRole;
}