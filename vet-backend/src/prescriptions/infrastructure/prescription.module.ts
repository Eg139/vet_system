import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionTypeOrmEntity } from './persistence/typeorm/entities/prescription.typeorm-entity';
import { PrescriptionRepositoryImpl } from './persistence/typeorm/repositories/prescription.repository';
import { PRESCRIPTION_REPOSITORY_TOKEN } from '../domain/ports/prescription.repository.interface';
import { CreatePrescriptionUseCase } from '../application/use-cases/create-prescription.use-case';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { MedicalHistoryModule } from '../../medical-history/infrastructure/medical-history.module'; // Para validar la consulta SOAP
import { PatientsModule } from '../../patients/infrastructure/patients.module'; // 👈 1. Importa el módulo de pacientes

@Module({
  imports: [
    TypeOrmModule.forFeature([PrescriptionTypeOrmEntity]),
    MedicalHistoryModule, 
    PatientsModule, // 👈 2. Agrégalo aquí para que NestJS resuelva los repositorios de Pet y Owner
  ],
  controllers: [PrescriptionsController],
  providers: [
    CreatePrescriptionUseCase,
    {
      provide: PRESCRIPTION_REPOSITORY_TOKEN,
      useClass: PrescriptionRepositoryImpl,
    },
  ],
  exports: [PRESCRIPTION_REPOSITORY_TOKEN],
})
export class PrescriptionsModule {}