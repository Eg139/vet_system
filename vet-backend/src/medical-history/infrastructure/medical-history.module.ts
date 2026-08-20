import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidad ORM exclusiva de Consultas SOAP
import { ConsultationOrmEntity } from './persistence/typeorm/entities/consultation.typeorm-entity';

// Controlador exclusivo de Historia Clínica
import { MedicalHistoryController } from '../infrastructure/controllers/medical-history.controller';

// Casos de Uso - Consultas SOAP y Timeline
import { CreateConsultationUseCase } from '../application/use-cases/create-consultation.use-case';
import { GetPatientConsultationsUseCase } from '../application/use-cases/get-patient-consultations.use-case';
import { GetPatientTimelineUseCase } from '../application/use-cases/get-patient-timeline.use-case';
import { GetConsultationByIdUseCase } from '../application/use-cases/get-consultation-by-id.use-case';
import { UpdateConsultationUseCase } from '../application/use-cases/update-consultation.use-case';

// Repositorio y Token
import { MEDICAL_HISTORY_REPOSITORY_TOKEN } from '../domain/ports/medical-history.repository.interface';
import { MedicalHistoryRepository } from '../infrastructure/persistence/typeorm/repositories/medical-history.repository';

// Módulos externos necesarios para el Timeline
import { VaccinesModule } from '../../vaccines/infrastructure/vaccines.module';
import { TreatmentModule } from '../../treatment/infrastructure/treatment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultationOrmEntity]),
    VaccinesModule,   // <-- Importado para que el Timeline pueda consultar vacunas
    TreatmentModule,  // <-- Importado para que el Timeline pueda consultar tratamientos
  ],
  controllers: [
    MedicalHistoryController,
  ],
  providers: [
    CreateConsultationUseCase,
    GetPatientConsultationsUseCase,
    GetPatientTimelineUseCase,
    GetConsultationByIdUseCase,
    UpdateConsultationUseCase,
    {
      provide: MEDICAL_HISTORY_REPOSITORY_TOKEN,
      useClass: MedicalHistoryRepository,
    },
  ],
  exports: [
    CreateConsultationUseCase,
    GetPatientConsultationsUseCase,
    GetPatientTimelineUseCase,
  ],
})
export class MedicalHistoryModule {}