import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { CreatePrescriptionUseCase } from '../../application/use-cases/create-prescription.use-case';
import { CreatePrescriptionHttpDto } from '../dtos/create-prescription.http.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly createPrescriptionUseCase: CreatePrescriptionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generar y registrar receta médica digital basada en consulta SOAP con auditoría' })
  async create(@Body() dto: CreatePrescriptionHttpDto, @Req() req: any) {
    // Extraemos los datos del contexto de seguridad (Multi-tenant y Auth)
    const orgId = req.user?.orgId || 'default-org-uuid'; 
    const veterinarianName = req.user?.name || 'Dr. Veterinario'; 

    return await this.createPrescriptionUseCase.execute({
      consultationId: dto.consultationId,
      orgId,
      veterinarianName,
    });
  }
}