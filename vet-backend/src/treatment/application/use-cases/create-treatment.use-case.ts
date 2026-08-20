import { Injectable, Inject } from '@nestjs/common';
import { 
  ITreatmentRepository, 
  TREATMENT_REPOSITORY_TOKEN 
} from '../../domain/ports/treatment.repository.interface';
import { TreatmentEntity } from '../../domain/entities/treatment.entity';

export interface CreateTreatmentDto {
  id: string;
  patientId: string;
  orgId: string;
  medicationName: string;
  dosage: string;
  startDate: Date | string; // <--- Soporta string o Date
  endDate: Date | string;   // <--- Soporta string o Date
  prescribedBy: string;
  instructions?: string;    // <--- Opcional con ?
}

@Injectable()
export class CreateTreatmentUseCase {
  constructor(
    @Inject(TREATMENT_REPOSITORY_TOKEN)
    private readonly treatmentRepository: ITreatmentRepository,
  ) {}

  async execute(dto: CreateTreatmentDto): Promise<TreatmentEntity> {
    const treatment = new TreatmentEntity(
      dto.id,
      dto.patientId,
      dto.orgId,
      dto.medicationName,
      dto.dosage,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.prescribedBy,
      dto.instructions ?? '',
      true, 
      new Date(),
    );

    return await this.treatmentRepository.save(treatment);
  }
}