import { Injectable, Inject } from '@nestjs/common';
import { 
  ITreatmentRepository, 
  TREATMENT_REPOSITORY_TOKEN 
} from '../../domain/ports/treatment.repository.interface';
import { TreatmentEntity } from '../../domain/entities/treatment.entity';

@Injectable()
export class GetPatientTreatmentsUseCase {
  constructor(
    @Inject(TREATMENT_REPOSITORY_TOKEN)
    private readonly treatmentRepository: ITreatmentRepository,
  ) {}

  async execute(patientId: string, orgId: string): Promise<TreatmentEntity[]> {
    return await this.treatmentRepository.findByPatientId(patientId, orgId);
  }
}