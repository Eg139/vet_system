import { 
  Injectable, 
  Inject, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { 
  IMedicalHistoryRepository, 
  MEDICAL_HISTORY_REPOSITORY_TOKEN 
} from '../../domain/ports/medical-history.repository.interface';
import { ConsultationEntity } from '../../domain/entities/consultation.entity';
import { CreateConsultationHttpDto } from '../../infrastructure/dtos/create-consultation.dto';
import { ConsultationOrmEntity } from '../../infrastructure/persistence/typeorm/entities/consultation.typeorm-entity';

export interface CreateConsultationInput {
  patientId: string;
  orgId: string;
  veterinarian: string;
  dto: CreateConsultationHttpDto;
}

@Injectable()
export class CreateConsultationUseCase {
  constructor(
    @Inject(MEDICAL_HISTORY_REPOSITORY_TOKEN)
    private readonly medicalHistoryRepository: IMedicalHistoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: CreateConsultationInput) {
    // 1. Lectura y validaciones previas (ej. verificar que el paciente exista, etc.)
    // const patient = await this.patientRepository.findById(input.patientId, input.orgId);
    // if (!patient) {
    //   throw new NotFoundException('No se encontró la mascota especificada.');
    // }

    // 2. Instanciación de la entidad de Dominio pura (aplica sus propias reglas de negocio/invariantes)
    const consultation = new ConsultationEntity(
      crypto.randomUUID(),
      input.patientId,
      input.orgId,
      input.veterinarian,
      input.dto.subjective,
      input.dto.objective,
      input.dto.assessment,
      input.dto.plan,
      input.dto.weight,
      input.dto.temperature,
      input.dto.heartRate,
      input.dto.respiratoryRate,
      new Date(),
    );

    // 3. Ejecución Atómica (ACID Transaction por si involucra actualizar el peso del paciente o inventario en paralelo)
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        // Step A: Persistir la consulta usando el repositorio o el entityManager transaccional
        const savedConsultation = await this.medicalHistoryRepository.saveConsultationWithTransaction(
          consultation,
          transactionalEntityManager,
        );

        // Step B (Opcional): Si la consulta trae peso, actualizar la ficha biológica del paciente en la misma transacción
        // if (input.dto.weight) {
        //   await transactionalEntityManager.update(
        //     PatientOrmEntity,
        //     { id: input.patientId, orgId: input.orgId },
        //     { currentWeight: input.dto.weight }
        //   );
        // }

        return {
          message: 'Evolución clínica registrada exitosamente.',
          consultationId: savedConsultation.getId(),
        };
      } catch (error) {
        // Preservamos las excepciones HTTP conocidas
        if (
          error instanceof BadRequestException || 
          error instanceof NotFoundException
        ) {
          throw error;
        }
        throw new InternalServerErrorException('Error al intentar registrar la consulta médica.');
      }
    });
  }
}