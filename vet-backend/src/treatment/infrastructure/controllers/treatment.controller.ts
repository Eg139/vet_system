import { Controller, Get, Post, Patch, Body, Param, Query, Headers } from '@nestjs/common';
import { CreateTreatmentUseCase } from '../../application/use-cases/create-treatment.use-case';
import { GetPatientTreatmentsUseCase } from '../../application/use-cases/get-patient-treatments.use-case';
import { DiscontinueTreatmentUseCase } from '../../application/use-cases/discontinue-treatment.use-case';
import { CreateTreatmentDto } from '../dtos/create-treatment.dto';

@Controller('patients/:patientId/treatments')
export class TreatmentController {
  constructor(
    private readonly createTreatmentUseCase: CreateTreatmentUseCase,
    private readonly getPatientTreatmentsUseCase: GetPatientTreatmentsUseCase,
    private readonly discontinueTreatmentUseCase: DiscontinueTreatmentUseCase,
  ) {}

@Post()
  async create(
    @Param('patientId') patientId: string,
    @Headers('x-org-id') orgId: string,
    @Body() dto: CreateTreatmentDto,
  ) {
    return await this.createTreatmentUseCase.execute({
      ...dto,
      patientId,
      orgId,
      startDate: new Date(dto.startDate), // <--- Conversión explícita
      endDate: new Date(dto.endDate),     // <--- Conversión explícita
    });
  }

  @Get()
  async findAll(
    @Param('patientId') patientId: string,
    @Headers('x-org-id') orgId: string,
  ) {
    const treatments = await this.getPatientTreatmentsUseCase.execute(patientId, orgId);
    
    // Mapeo simple a objeto plano para la respuesta HTTP si lo deseas
    return treatments.map(t => ({
      id: t.getId(),
      patientId: t.getPatientId(),
      medicationName: t.getMedicationName(),
      dosage: t.getDosage(),
      startDate: t.getStartDate(),
      endDate: t.getEndDate(),
      prescribedBy: t.getPrescribedBy(),
      instructions: t.getInstructions(),
      active: t.isActive(),
      createdAt: t.getCreatedAt(),
    }));
  }

  @Patch(':treatmentId/discontinue')
  async discontinue(
    @Param('treatmentId') treatmentId: string,
    @Headers('x-org-id') orgId: string,
  ) {
    const treatment = await this.discontinueTreatmentUseCase.execute(treatmentId, orgId);
    return {
      id: treatment.getId(),
      active: treatment.isActive(),
      message: 'Tratamiento discontinuado exitosamente.',
    };
  }
}