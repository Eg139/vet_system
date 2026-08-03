import { Controller, Post, Get,Patch, Param, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateConsultationUseCase } from '../../application/use-cases/create-consultation.use-case';
import { CreateConsultationHttpDto } from '../dtos/create-consultation.dto';
import { GetPatientConsultationsUseCase } from 'src/medical-history/application/use-cases/get-patient-consultations.use-case';
import { MedicalHistoryTimelineItemDto } from '../dtos/medical-history-timeline-item.dto';
import { GetPatientTimelineUseCase } from 'src/medical-history/application/use-cases/get-patient-timeline.use-case';
import { GetConsultationByIdUseCase } from 'src/medical-history/application/use-cases/get-consultation-by-id.use-case';
import { ConsultationResponseDto } from '../dtos/consultation-response.dto';
import { ConsultationHttpMapper } from '../persistence/typeorm/mappers/consultation-http.mapper';
import { UpdateConsultationUseCase } from 'src/medical-history/application/use-cases/update-consultation.use-case';
import { UpdateConsultationHttpDto } from '../dtos/update-consultation.dto';



@ApiTags('Medical History')
@ApiBearerAuth()
@Controller('patients/:patientId/medical-history/consultations')
export class MedicalHistoryController {
  constructor(
    private readonly createConsultationUseCase: CreateConsultationUseCase,
    // 1. INYECTAMOS EL NUEVO CASO DE USO AQUÍ (con minúscula inicial):
    private readonly getPatientConsultationsUseCase: GetPatientConsultationsUseCase, 
    private readonly getPatientTimelineUseCase: GetPatientTimelineUseCase,
    private readonly getConsultationByIdUseCase: GetConsultationByIdUseCase,
    private readonly updateConsultationUseCase: UpdateConsultationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una evolución clínica SOAP', description: 'Crea un nuevo registro SOAP y constantes vitales dentro de la historia clínica del paciente.' })
  @ApiParam({ name: 'patientId', type: String, description: 'ID de la mascota paciente' })
  @ApiResponse({ status: 201, description: 'Consulta SOAP registrada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async create(
    @Param('patientId') patientId: string,
    @Body() dto: CreateConsultationHttpDto,
    @Req() req: any
  ) {
    const orgId = req.user?.orgId || 'org-test-id';
    const veterinarian = req.user?.name || 'Dr. Veterinario (Sesión)';

    return await this.createConsultationUseCase.execute({
      patientId,
      orgId,
      veterinarian,
      dto,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la línea de tiempo de consultas SOAP de un paciente' })
  @ApiParam({ name: 'patientId', type: String, description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Historial clínico recuperado con éxito.' })
  async getByPatient(
    @Param('patientId') patientId: string,
    @Req() req: any
  ) {
    const orgId = req.user?.orgId || 'org-test-id';
    
    // 2. USAMOS EL NOMBRE DE LA VARIABLE (minúscula inicial):
    const consultations = await this.getPatientConsultationsUseCase.execute(patientId, orgId);

    // Mapeamos a un formato limpio o plano que tu frontend pueda consumir fácilmente en la UI
    return consultations.map(consultation => ({
      id: consultation.getId(),
      patientId: consultation.getPatientId(),
      veterinarian: consultation.getVeterinarian(),
      subjective: consultation.getSubjective(),
      objective: consultation.getObjective(),
      assessment: consultation.getAssessment(),
      plan: consultation.getPlan(),
      weight: consultation.getWeight(),
      temperature: consultation.getTemperature(),
      heartRate: consultation.getHeartRate(),
      respiratoryRate: consultation.getRespiratoryRate(),
      createdAt: consultation.getCreatedAt(),
    }));
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Obtener la línea de tiempo global unificada del historial clínico' })
  @ApiResponse({ status: 200, description: 'Línea de tiempo recuperada con éxito.', type: [MedicalHistoryTimelineItemDto] })
  async getTimeline(
    @Param('patientId') patientId: string,
    @Req() req: any
  ): Promise<MedicalHistoryTimelineItemDto[]> {
    const orgId = req.user?.orgId || 'org-test-id';
    return await this.getPatientTimelineUseCase.execute(patientId, orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una consulta SOAP por su ID' })
  @ApiParam({ name: 'patientId', type: String, description: 'ID de la mascota' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la consulta médica' })
  @ApiResponse({ status: 200, description: 'Detalle de la consulta recuperado con éxito.', type: ConsultationResponseDto })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada.' })
  async getById(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Req() req: any
  ): Promise<ConsultationResponseDto> {
    const orgId = req.user?.orgId || 'org-test-id';
    
    const consultation = await this.getConsultationByIdUseCase.execute(id, orgId);

    return ConsultationHttpMapper.toResponseDto(consultation);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar o corregir una consulta SOAP existente' })
  @ApiParam({ name: 'patientId', type: String, description: 'ID de la mascota' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la consulta médica' })
  @ApiResponse({ status: 200, description: 'Consulta actualizada con éxito.', type: ConsultationResponseDto })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async update(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: UpdateConsultationHttpDto,
    @Req() req: any
  ): Promise<ConsultationResponseDto> {
    const orgId = req.user?.orgId || 'org-test-id';

    const updatedConsultation = await this.updateConsultationUseCase.execute(id, orgId, dto);

    return ConsultationHttpMapper.toResponseDto(updatedConsultation);
  }
}