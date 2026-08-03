import { Injectable, Inject } from '@nestjs/common';
import { 
  IVaccineRepository, 
  VACCINE_REPOSITORY_TOKEN 
} from '../../domain/ports/vaccine.repository.interface';
import { VaccineEntity } from '../../domain/entities/vaccine.entity';

@Injectable()
export class GetPatientVaccinesUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY_TOKEN)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(patientId: string, orgId: string): Promise<VaccineEntity[]> {
    return await this.vaccineRepository.findByPatientId(patientId, orgId);
  }
}