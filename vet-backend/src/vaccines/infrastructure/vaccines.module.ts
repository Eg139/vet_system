import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccineTypeOrmEntity } from '../infrastructure/persistence/typeorm/entities/vaccine.typeorm-entity';
import { VaccineRepository } from '../infrastructure/persistence/typeorm/repositories/vaccine.repository';
import { VACCINE_REPOSITORY_TOKEN } from '../domain/ports/vaccine.repository.interface';
import { RegisterVaccineUseCase } from '../application/use-cases/register-vaccine.use-case';
import { GetPatientVaccinesUseCase } from '../application/use-cases/get-patient-vaccines.use-case';
import { VaccinesController } from '../infrastructure/controllers/vaccine.controller';
import { GetVaccineByIdUseCase } from '../application/use-cases/get-vaccine-by-id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([VaccineTypeOrmEntity])],
  controllers: [VaccinesController],
  providers: [
    RegisterVaccineUseCase,
    GetPatientVaccinesUseCase,
    GetVaccineByIdUseCase, // <--- ¡Faltaba agregarlo aquí!
    {
      provide: VACCINE_REPOSITORY_TOKEN,
      useClass: VaccineRepository,
    },
  ],
  exports: [
    GetPatientVaccinesUseCase, 
    GetVaccineByIdUseCase, 
    RegisterVaccineUseCase
  ],
})
export class VaccinesModule {}