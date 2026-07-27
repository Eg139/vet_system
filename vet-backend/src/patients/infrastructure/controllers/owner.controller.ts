// src/patients/infrastructure/controllers/owner.controller.ts

import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  BadRequestException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClaimOwnerAccountUseCase } from '../../application/use-cases/claim-owner-account.use-case';
import { ClaimAccountDto } from '../controllers/dtos/claim-account-dto';

@ApiTags('Owners (Dueños)')
@Controller('owners')
export class OwnerController {
  constructor(
    private readonly claimOwnerAccountUseCase: ClaimOwnerAccountUseCase,
  ) {}

  @Post('claim-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reclamar / Crear cuenta de usuario para un cliente existente',
    description:
      'Permite a un cliente de la veterinaria crear sus credenciales de acceso para la aplicación de Angular si ya cuenta con una ficha/mascota registrada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta vinculada exitosamente.',
    schema: {
      example: {
        message: 'Cuenta vinculada exitosamente.',
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El cliente ya tiene una cuenta activa o los datos son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe ninguna ficha de cliente registrada con ese correo electrónico en esta organización.',
  })
  async claimAccount(@Body() dto: ClaimAccountDto) {
    return await this.claimOwnerAccountUseCase.execute(dto);
  }
}