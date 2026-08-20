import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterVaccineUseCase } from '../../application/use-cases/register-vaccine.use-case';
import { GetPatientVaccinesUseCase } from '../../application/use-cases/get-patient-vaccines.use-case';
import { RegisterVaccineHttpDto } from '../dtos/register-vaccine.dto';
import { VaccineResponseDto } from '../dtos/vaccine-response.dto';
import { VaccineEntity } from '../../domain/entities/vaccine.entity';

@ApiTags('Medical History - Vaccines')
@Controller('patients/:patientId/vaccines')
export class VaccinesController {
  constructor(
    private readonly registerVaccineUseCase: RegisterVaccineUseCase,
    private readonly getPatientVaccinesUseCase: GetPatientVaccinesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar la aplicación de una vacuna a un paciente' })
  @ApiResponse({ status: 201, description: 'Vacuna registrada exitosamente', type: VaccineResponseDto })
  async register(
    @Param('patientId') patientId: string,
    @Query('orgId') orgId: string, // Temporal hasta que integremos el Guard de Auth/Tenant
    @Body() dto: RegisterVaccineHttpDto,
  ): Promise<VaccineResponseDto> {
    // Nota: El 'administeredBy' lo podemos extraer del usuario autenticado en el futuro; 
    // por ahora lo dejamos mapeado o configurable si lo agregas al DTO.
    const vaccine = await this.registerVaccineUseCase.execute({
        patientId,
        orgId: orgId ?? 'default-org',
        administeredBy: 'Dr. Asignado', // Temporal hasta tener sesión activa
        dto, // <- Aquí le pasas el DTO completo que viene del Body
        });

    return this.toResponseDto(vaccine);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener el historial de vacunas de un paciente' })
  @ApiResponse({ status: 200, description: 'Historial de vacunas obtenido correctamente', type: [VaccineResponseDto] })
  async getByPatient(
    @Param('patientId') patientId: string,
    @Query('orgId') orgId: string,
  ): Promise<VaccineResponseDto[]> {
    const vaccines = await this.getPatientVaccinesUseCase.execute(patientId, orgId ?? 'default-org');
    return vaccines.map(v => this.toResponseDto(v));
  }

  // Mapper interno para transformar Entidad de Dominio -> Response DTO
  private toResponseDto(v: VaccineEntity): VaccineResponseDto {
    const dto = new VaccineResponseDto();
    dto.id = v.getId();
    dto.patientId = v.getPatientId();
    dto.vaccineName = v.getVaccineName();
    dto.batchNumber = v.getBatchNumber();
    dto.administeredBy = v.getAdministeredBy();
    dto.applicationDate = v.getApplicationDate();
    dto.nextDueDate = v.getNextDueDate();
    dto.notes = v.getNotes();
    dto.createdAt = v.getCreatedAt();
    return dto;
  }
}