import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistoryController } from '../infrastructure/controllers/medical-history.controller';
import { CreateConsultationUseCase } from '../application/use-cases/create-consultation.use-case';
import { GetPatientConsultationsUseCase } from '../application/use-cases/get-patient-consultations.use-case'; // <--- 1. Ya lo tienes importado arriba
import { MEDICAL_HISTORY_REPOSITORY_TOKEN } from '../domain/ports/medical-history.repository.interface';
import { MedicalHistoryRepository } from '../infrastructure/persistence/typeorm/repositories/medical-history.repository';
import { ConsultationOrmEntity } from '../infrastructure/persistence/typeorm/entities/consultation.orm-entity';
import { GetPatientTimelineUseCase } from '../application/use-cases/get-patient-timeline.use-case';
import { GetConsultationByIdUseCase } from '../application/use-cases/get-consultation-by-id.use-case';
import { UpdateConsultationUseCase } from '../application/use-cases/update-consultation.use-case';


@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultationOrmEntity]),
  ],
  controllers: [MedicalHistoryController],
  providers: [
    CreateConsultationUseCase,
    GetPatientConsultationsUseCase,
    GetPatientTimelineUseCase,
    GetConsultationByIdUseCase,
    UpdateConsultationUseCase, // <--- 2. Agrégalo aquí en los providers
    {
      provide: MEDICAL_HISTORY_REPOSITORY_TOKEN,
      useClass: MedicalHistoryRepository,
    },
  ],
  exports: [
    CreateConsultationUseCase,
    GetPatientConsultationsUseCase, // <--- 3. (Opcional) Si quieres exportarlo para otros módulos
  ],
})
export class MedicalHistoryModule {}