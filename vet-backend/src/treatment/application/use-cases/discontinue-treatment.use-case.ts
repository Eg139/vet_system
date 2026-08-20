import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { 
  ITreatmentRepository, 
  TREATMENT_REPOSITORY_TOKEN 
} from '../../domain/ports/treatment.repository.interface';
import { TreatmentEntity } from '../../domain/entities/treatment.entity';

@Injectable()
export class DiscontinueTreatmentUseCase {
  constructor(
    @Inject(TREATMENT_REPOSITORY_TOKEN)
    private readonly treatmentRepository: ITreatmentRepository,
  ) {}

  async execute(treatmentId: string, orgId: string): Promise<TreatmentEntity> {
    const treatment = await this.treatmentRepository.findById(treatmentId, orgId);
    
    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${treatmentId} no encontrado.`);
    }

    // Aplicamos el método semántico de negocio que definimos en la entidad
    treatment.discontinue();

    return await this.treatmentRepository.save(treatment);
  }
}