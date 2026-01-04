import { IsString, IsNotEmpty, IsOptional, IsUrl, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Veterinaria San Roque' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la organización es obligatorio' })
  @MinLength(3)
  name: string;

@ApiProperty({ 
    example: '20123456789', 
    description: 'CUIT sin guiones (opcional en registro inicial)',
    required: false 
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'El taxId debe contener solo números' })
  taxId?: string; // ✅ Agregamos el signo '?' para TypeScript

    @ApiProperty({ 
        example: 'https://mi-bucket.s3.amazonaws.com/logos/vet-1.png',
        description: 'Ruta o URL del logo de la organización',
        required: false 
    })
    @IsOptional()
    @IsString({ message: 'El logoUrl debe ser una cadena de texto' })
    logoUrl?: string;

  @ApiProperty({ example: 'FREE', default: 'FREE' })
  @IsOptional()
  @IsString()
  planType?: string;
}