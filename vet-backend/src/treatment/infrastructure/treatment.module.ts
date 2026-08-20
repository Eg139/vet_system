import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentTypeOrmEntity } from './persistence/typeorm/entities/treatment.typeorm-entity';
import { TreatmentRepository } from './persistence/typeorm/repositories/treatment.repository';
import { TREATMENT_REPOSITORY_TOKEN } from '../domain/ports/treatment.repository.interface';
import { CreateTreatmentUseCase } from '../application/use-cases/create-treatment.use-case';
import { GetPatientTreatmentsUseCase } from '../application/use-cases/get-patient-treatments.use-case';
import { DiscontinueTreatmentUseCase } from '../application/use-cases/discontinue-treatment.use-case';
import { TreatmentController } from './controllers/treatment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentTypeOrmEntity])],
  controllers: [TreatmentController],
  providers: [
    CreateTreatmentUseCase,
    GetPatientTreatmentsUseCase,
    DiscontinueTreatmentUseCase,
    {
      provide: TREATMENT_REPOSITORY_TOKEN,
      useClass: TreatmentRepository,
    },
  ],
  exports: [GetPatientTreatmentsUseCase,CreateTreatmentUseCase,DiscontinueTreatmentUseCase], // Exportado para que el timeline pueda consumirlo
})
export class TreatmentModule {}